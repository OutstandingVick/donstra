// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DonstraRegistry
/// @notice Executes pre-committed actions and escrows accountability bonds.
contract DonstraRegistry {
    enum Status {
        None,
        Committed,
        Executed,
        Challenged,
        Resolved,
        Cancelled
    }
    enum Verdict {
        Reasonable,
        Negligent,
        Fabricated,
        Inconclusive
    }

    struct Commitment {
        address agent;
        bytes32 testimonyDigest;
        bytes32 actionDigest;
        bytes32 actionTransactionId;
        uint64 committedAt;
        uint64 expiresAt;
        uint64 executedAt;
        uint64 challengedAt;
        uint96 bond;
        uint96 challengeBond;
        address challenger;
        Status status;
    }

    address public immutable adjudicator;
    uint96 public immutable minimumAgentBond;
    uint96 public immutable minimumChallengeBond;
    uint64 public immutable challengeWindow;
    uint64 public immutable adjudicationWindow;
    mapping(bytes32 => Commitment) public commitments;
    mapping(address => uint256) public claimable;
    bool private withdrawing;

    event TestimonyCommitted(
        bytes32 indexed receiptId, address indexed agent, bytes32 testimonyDigest, bytes32 actionDigest, uint256 bond
    );
    event ActionExecuted(bytes32 indexed receiptId, address indexed target, bytes32 actionTransactionId);
    event Challenged(bytes32 indexed receiptId, address indexed challenger, uint256 challengeBond);
    event Resolved(bytes32 indexed receiptId, Verdict verdict, address bondRecipient);
    event CommitmentCancelled(bytes32 indexed receiptId);
    event ChallengeExpired(bytes32 indexed receiptId);
    event Withdrawal(address indexed account, address indexed recipient, uint256 amount);

    error Unauthorized();
    error InvalidState();
    error InvalidAction();
    error InvalidBond();
    error InvalidWindow();
    error InvalidConfiguration();
    error NothingToWithdraw();
    error TransferFailed();
    error ReentrantWithdrawal();

    constructor(
        address adjudicator_,
        uint96 minimumAgentBond_,
        uint96 minimumChallengeBond_,
        uint64 challengeWindow_,
        uint64 adjudicationWindow_
    ) {
        if (
            adjudicator_ == address(0) || minimumAgentBond_ == 0 || minimumChallengeBond_ == 0 || challengeWindow_ == 0
                || adjudicationWindow_ == 0
        ) {
            revert InvalidConfiguration();
        }
        adjudicator = adjudicator_;
        minimumAgentBond = minimumAgentBond_;
        minimumChallengeBond = minimumChallengeBond_;
        challengeWindow = challengeWindow_;
        adjudicationWindow = adjudicationWindow_;
    }

    function commit(bytes32 receiptId, bytes32 testimonyDigest, bytes32 actionDigest, uint64 expiresAt)
        external
        payable
    {
        if (receiptId == bytes32(0) || testimonyDigest == bytes32(0) || actionDigest == bytes32(0)) {
            revert InvalidAction();
        }
        if (commitments[receiptId].status != Status.None) revert InvalidState();
        if (expiresAt <= block.timestamp) revert InvalidWindow();
        if (msg.value < minimumAgentBond || msg.value > type(uint96).max) revert InvalidBond();
        commitments[receiptId] = Commitment({
            agent: msg.sender,
            testimonyDigest: testimonyDigest,
            actionDigest: actionDigest,
            actionTransactionId: bytes32(0),
            committedAt: uint64(block.timestamp),
            expiresAt: expiresAt,
            executedAt: 0,
            challengedAt: 0,
            bond: uint96(msg.value),
            challengeBond: 0,
            challenger: address(0),
            status: Status.Committed
        });
        emit TestimonyCommitted(receiptId, msg.sender, testimonyDigest, actionDigest, msg.value);
    }

    /// @dev Action value must accompany this call; escrowed bonds can never fund actions.
    function execute(bytes32 receiptId, address target, uint256 value, bytes calldata data, uint64 deadline)
        external
        payable
        returns (bytes memory result)
    {
        Commitment storage item = commitments[receiptId];
        if (item.agent != msg.sender) revert Unauthorized();
        if (item.status != Status.Committed) revert InvalidState();
        if (target == address(0) || block.timestamp > item.expiresAt || block.timestamp > deadline) {
            revert InvalidWindow();
        }
        if (msg.value != value) revert InvalidBond();
        bytes32 supplied = keccak256(abi.encode(block.chainid, target, value, keccak256(data), deadline));
        if (supplied != item.actionDigest) revert InvalidAction();

        item.status = Status.Executed;
        item.executedAt = uint64(block.timestamp);
        item.actionTransactionId = keccak256(abi.encode(block.chainid, address(this), receiptId, block.number));
        (bool ok, bytes memory returned) = target.call{value: value}(data);
        if (!ok) {
            assembly { revert(add(returned, 32), mload(returned)) }
        }
        emit ActionExecuted(receiptId, target, item.actionTransactionId);
        return returned;
    }

    function cancelExpired(bytes32 receiptId) external {
        Commitment storage item = commitments[receiptId];
        if (item.agent != msg.sender) revert Unauthorized();
        if (item.status != Status.Committed) revert InvalidState();
        if (block.timestamp <= item.expiresAt) revert InvalidWindow();
        item.status = Status.Cancelled;
        _credit(item.agent, item.bond);
        item.bond = 0;
        emit CommitmentCancelled(receiptId);
    }

    function challenge(bytes32 receiptId) external payable {
        Commitment storage item = commitments[receiptId];
        if (item.status != Status.Executed) revert InvalidState();
        if (block.timestamp > uint256(item.executedAt) + challengeWindow) revert InvalidWindow();
        if (msg.value < minimumChallengeBond || msg.value > type(uint96).max) revert InvalidBond();
        item.status = Status.Challenged;
        item.challenger = msg.sender;
        item.challengedAt = uint64(block.timestamp);
        item.challengeBond = uint96(msg.value);
        emit Challenged(receiptId, msg.sender, msg.value);
    }

    function finalizeUnchallenged(bytes32 receiptId) external {
        Commitment storage item = commitments[receiptId];
        if (item.status != Status.Executed) revert InvalidState();
        if (block.timestamp <= uint256(item.executedAt) + challengeWindow) revert InvalidWindow();
        item.status = Status.Resolved;
        _credit(item.agent, item.bond);
        item.bond = 0;
        emit Resolved(receiptId, Verdict.Inconclusive, item.agent);
    }

    function expireChallenge(bytes32 receiptId) external {
        Commitment storage item = commitments[receiptId];
        if (item.status != Status.Challenged) revert InvalidState();
        if (block.timestamp <= uint256(item.challengedAt) + adjudicationWindow) revert InvalidWindow();
        item.status = Status.Resolved;
        _credit(item.agent, item.bond);
        _credit(item.challenger, item.challengeBond);
        item.bond = 0;
        item.challengeBond = 0;
        emit ChallengeExpired(receiptId);
        emit Resolved(receiptId, Verdict.Inconclusive, item.agent);
    }

    function resolve(bytes32 receiptId, Verdict verdict) external {
        if (msg.sender != adjudicator) revert Unauthorized();
        Commitment storage item = commitments[receiptId];
        if (item.status != Status.Challenged) revert InvalidState();
        if (block.timestamp > uint256(item.challengedAt) + adjudicationWindow) revert InvalidWindow();
        item.status = Status.Resolved;

        address bondRecipient;
        if (verdict == Verdict.Negligent || verdict == Verdict.Fabricated) {
            bondRecipient = item.challenger;
            _credit(item.challenger, uint256(item.bond) + item.challengeBond);
        } else if (verdict == Verdict.Reasonable) {
            bondRecipient = item.agent;
            _credit(item.agent, uint256(item.bond) + item.challengeBond);
        } else {
            bondRecipient = item.agent;
            _credit(item.agent, item.bond);
            _credit(item.challenger, item.challengeBond);
        }
        item.bond = 0;
        item.challengeBond = 0;
        emit Resolved(receiptId, verdict, bondRecipient);
    }

    function withdraw(address payable recipient) external {
        if (withdrawing) revert ReentrantWithdrawal();
        if (recipient == address(0)) revert InvalidAction();
        uint256 amount = claimable[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        claimable[msg.sender] = 0;
        withdrawing = true;
        (bool ok,) = recipient.call{value: amount}("");
        withdrawing = false;
        if (!ok) revert TransferFailed();
        emit Withdrawal(msg.sender, recipient, amount);
    }

    function _credit(address account, uint256 amount) private {
        if (amount > 0) claimable[account] += amount;
    }
}
