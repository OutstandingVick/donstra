// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraRegistry} from "./DonstraRegistry.sol";
import {ECDSA} from "./ECDSA.sol";

/// @title DonstraSettlementRelay
/// @notice Resolves EVM bonds after a reporter quorum attests to GenLayer consensus.
contract DonstraSettlementRelay {
    struct Settlement {
        bytes32 receiptId;
        bytes32 adjudicationTxHash;
        uint8 verdict;
        uint64 adjudicatedAt;
        uint64 validUntil;
    }

    bytes32 public constant SETTLEMENT_TYPEHASH = keccak256(
        "Settlement(bytes32 receiptId,bytes32 adjudicationTxHash,uint8 verdict,uint64 adjudicatedAt,uint64 validUntil,address sourceContract,bytes32 sourceChainId)"
    );
    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant NAME_HASH = keccak256("Donstra Settlement Relay");
    bytes32 private constant VERSION_HASH = keccak256("1");

    DonstraRegistry public immutable registry;
    address public immutable sourceContract;
    bytes32 public immutable sourceChainId;
    uint8 public immutable quorum;
    uint64 public immutable maxSourceAge;

    uint64 public constant MAX_FUTURE_DRIFT = 5 minutes;

    mapping(address => bool) public isReporter;
    mapping(bytes32 => bool) public processed;

    event ReporterConfigured(address indexed reporter);
    event RegistryDeployed(address indexed registry);
    event SettlementRelayed(
        bytes32 indexed receiptId,
        bytes32 indexed adjudicationTxHash,
        DonstraRegistry.Verdict verdict,
        uint256 signerCount
    );

    error InvalidConfiguration();
    error InvalidSettlement();
    error InvalidReporter();
    error InsufficientQuorum();
    error AlreadyProcessed();
    error ExpiredSettlement();
    error StaleSettlement();
    error FutureSettlement();

    constructor(
        address sourceContract_,
        bytes32 sourceChainId_,
        address[] memory reporters_,
        uint8 quorum_,
        uint64 maxSourceAge_,
        uint96 minimumAgentBond_,
        uint96 minimumChallengeBond_,
        uint64 challengeWindow_,
        uint64 adjudicationWindow_
    ) {
        if (
            sourceContract_ == address(0) || sourceChainId_ == bytes32(0) || quorum_ == 0 || quorum_ > reporters_.length
                || maxSourceAge_ == 0
        ) revert InvalidConfiguration();

        sourceContract = sourceContract_;
        sourceChainId = sourceChainId_;
        quorum = quorum_;
        maxSourceAge = maxSourceAge_;

        for (uint256 i; i < reporters_.length; ++i) {
            address reporter = reporters_[i];
            if (reporter == address(0) || isReporter[reporter]) revert InvalidConfiguration();
            isReporter[reporter] = true;
            emit ReporterConfigured(reporter);
        }

        registry = new DonstraRegistry(
            address(this), minimumAgentBond_, minimumChallengeBond_, challengeWindow_, adjudicationWindow_
        );
        emit RegistryDeployed(address(registry));
    }

    function settlementDigest(Settlement calldata settlement) public view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                SETTLEMENT_TYPEHASH,
                settlement.receiptId,
                settlement.adjudicationTxHash,
                settlement.verdict,
                settlement.adjudicatedAt,
                settlement.validUntil,
                sourceContract,
                sourceChainId
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
    }

    function settle(Settlement calldata settlement, bytes[] calldata signatures) external {
        if (processed[settlement.receiptId]) revert AlreadyProcessed();
        if (settlement.receiptId == bytes32(0) || settlement.adjudicationTxHash == bytes32(0)) {
            revert InvalidSettlement();
        }
        if (settlement.verdict > uint8(DonstraRegistry.Verdict.Inconclusive)) revert InvalidSettlement();
        if (settlement.validUntil < settlement.adjudicatedAt || block.timestamp > settlement.validUntil) {
            revert ExpiredSettlement();
        }
        if (settlement.adjudicatedAt > block.timestamp + MAX_FUTURE_DRIFT) revert FutureSettlement();
        if (settlement.adjudicatedAt <= block.timestamp && block.timestamp - settlement.adjudicatedAt > maxSourceAge) {
            revert StaleSettlement();
        }
        if (signatures.length < quorum) revert InsufficientQuorum();

        bytes32 digest = settlementDigest(settlement);
        address previous;
        for (uint256 i; i < signatures.length; ++i) {
            address signer = ECDSA.recover(digest, signatures[i]);
            if (!isReporter[signer] || signer <= previous) revert InvalidReporter();
            previous = signer;
        }

        processed[settlement.receiptId] = true;
        DonstraRegistry.Verdict verdict = DonstraRegistry.Verdict(settlement.verdict);
        registry.resolve(settlement.receiptId, verdict);
        emit SettlementRelayed(settlement.receiptId, settlement.adjudicationTxHash, verdict, signatures.length);
    }

    function _domainSeparator() private view returns (bytes32) {
        return keccak256(abi.encode(DOMAIN_TYPEHASH, NAME_HASH, VERSION_HASH, block.chainid, address(this)));
    }
}
