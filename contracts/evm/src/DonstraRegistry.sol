// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DonstraRegistry
/// @notice Executes pre-committed actions and escrows the agent's accountability bond.
contract DonstraRegistry {
    enum Status {
        None,
        Committed,
        Executed,
        Challenged,
        Resolved
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
        uint96 bond;
        address challenger;
        Status status;
    }

    address public immutable adjudicator;
    mapping(bytes32 => Commitment) public commitments;

    event TestimonyCommitted(
        bytes32 indexed receiptId, address indexed agent, bytes32 testimonyDigest, bytes32 actionDigest, uint256 bond
    );
    event ActionExecuted(bytes32 indexed receiptId, address indexed target, bytes32 actionTransactionId);
    event Challenged(bytes32 indexed receiptId, address indexed challenger);
    event Resolved(bytes32 indexed receiptId, Verdict verdict, address bondRecipient);

    error Unauthorized();
    error InvalidState();
    error InvalidAction();
    error InvalidBond();
    error InvalidWindow();
    error TransferFailed();

    constructor(address adjudicator_) {
        if (adjudicator_ == address(0)) revert Unauthorized();
        adjudicator = adjudicator_;
    }

    function commit(bytes32 receiptId, bytes32 testimonyDigest, bytes32 actionDigest, uint64 expiresAt)
        external
        payable
    {
        if (commitments[receiptId].status != Status.None) revert InvalidState();
        if (expiresAt <= block.timestamp) revert InvalidWindow();
        if (msg.value > type(uint96).max) revert InvalidBond();
        commitments[receiptId] = Commitment({
            agent: msg.sender,
            testimonyDigest: testimonyDigest,
            actionDigest: actionDigest,
            actionTransactionId: bytes32(0),
            committedAt: uint64(block.timestamp),
            expiresAt: expiresAt,
            bond: uint96(msg.value),
            challenger: address(0),
            status: Status.Committed
        });
        emit TestimonyCommitted(receiptId, msg.sender, testimonyDigest, actionDigest, msg.value);
    }

    /// @notice Executes the exact action represented by actionDigest.
    /// digest = keccak256(abi.encode(chainid, target, value, keccak256(data), deadline)).
    function execute(bytes32 receiptId, address target, uint256 value, bytes calldata data, uint64 deadline)
        external
        returns (bytes memory result)
    {
        Commitment storage item = commitments[receiptId];
        if (item.agent != msg.sender) revert Unauthorized();
        if (item.status != Status.Committed) revert InvalidState();
        if (block.timestamp > item.expiresAt || block.timestamp > deadline) revert InvalidWindow();
        bytes32 supplied = keccak256(abi.encode(block.chainid, target, value, keccak256(data), deadline));
        if (supplied != item.actionDigest) revert InvalidAction();

        item.status = Status.Executed;
        item.actionTransactionId = keccak256(abi.encode(block.chainid, address(this), receiptId, block.number));
        (bool ok, bytes memory returned) = target.call{value: value}(data);
        if (!ok) {
            assembly {
                revert(add(returned, 32), mload(returned))
            }
        }
        emit ActionExecuted(receiptId, target, item.actionTransactionId);
        return returned;
    }

    function challenge(bytes32 receiptId) external {
        Commitment storage item = commitments[receiptId];
        if (item.status != Status.Executed) revert InvalidState();
        item.status = Status.Challenged;
        item.challenger = msg.sender;
        emit Challenged(receiptId, msg.sender);
    }

    function resolve(bytes32 receiptId, Verdict verdict) external {
        if (msg.sender != adjudicator) revert Unauthorized();
        Commitment storage item = commitments[receiptId];
        if (item.status != Status.Challenged) revert InvalidState();
        item.status = Status.Resolved;
        address recipient = verdict == Verdict.Negligent || verdict == Verdict.Fabricated ? item.challenger : item.agent;
        uint256 amount = item.bond;
        item.bond = 0;
        if (amount > 0) {
            (bool ok,) = recipient.call{value: amount}("");
            if (!ok) revert TransferFailed();
        }
        emit Resolved(receiptId, verdict, recipient);
    }
}
