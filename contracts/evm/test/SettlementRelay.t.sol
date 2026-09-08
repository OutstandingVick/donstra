// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraRegistry} from "../src/DonstraRegistry.sol";
import {DonstraSettlementRelay} from "../src/DonstraSettlementRelay.sol";

interface Vm {
    function addr(uint256 privateKey) external returns (address);
    function deal(address account, uint256 balance) external;
    function sign(uint256 privateKey, bytes32 digest) external returns (uint8 v, bytes32 r, bytes32 s);
    function warp(uint256 timestamp) external;
}

contract RelayCounter {
    uint256 public value;

    function set(uint256 next) external {
        value = next;
    }
}

contract SettlementRelayTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    uint256 private constant REPORTER_KEY = 0xA11CE;
    uint96 private constant AGENT_BOND = 1 ether;
    uint96 private constant CHALLENGE_BOND = 0.1 ether;

    DonstraSettlementRelay private relay;
    DonstraRegistry private registry;
    RelayCounter private counter;

    function setUp() public {
        vm.warp(1_700_000_000);
        vm.deal(address(this), 10 ether);
        address[] memory reporters = new address[](1);
        reporters[0] = vm.addr(REPORTER_KEY);
        relay = new DonstraSettlementRelay(
            address(0x1234),
            keccak256("genlayer-studionet"),
            reporters,
            1,
            1 days,
            AGENT_BOND,
            CHALLENGE_BOND,
            1 days,
            2 days
        );
        registry = relay.registry();
        counter = new RelayCounter();
    }

    function testRelaysSignedVerdictIntoRegistry() public {
        bytes32 receiptId = _challengeReceipt();
        DonstraSettlementRelay.Settlement memory settlement = _settlement(receiptId);

        bytes[] memory signatures = new bytes[](1);
        signatures[0] = _sign(REPORTER_KEY, relay.settlementDigest(settlement));
        relay.settle(settlement, signatures);

        (,,,,,,,,,,, DonstraRegistry.Status status) = registry.commitments(receiptId);
        assert(status == DonstraRegistry.Status.Resolved);
        assert(relay.processed(receiptId));
    }

    function testRejectsUnauthorizedReporter() public {
        bytes32 receiptId = _challengeReceipt();
        DonstraSettlementRelay.Settlement memory settlement = _settlement(receiptId);
        bytes[] memory signatures = new bytes[](1);
        signatures[0] = _sign(0xB0B, relay.settlementDigest(settlement));

        (bool ok,) = address(relay).call(abi.encodeCall(DonstraSettlementRelay.settle, (settlement, signatures)));
        assert(!ok);
        assert(!relay.processed(receiptId));
    }

    function testRejectsExpiredAttestation() public {
        bytes32 receiptId = _challengeReceipt();
        DonstraSettlementRelay.Settlement memory settlement = _settlement(receiptId);
        bytes[] memory signatures = new bytes[](1);
        signatures[0] = _sign(REPORTER_KEY, relay.settlementDigest(settlement));
        vm.warp(settlement.validUntil + 1);

        (bool ok,) = address(relay).call(abi.encodeCall(DonstraSettlementRelay.settle, (settlement, signatures)));
        assert(!ok);
        assert(!relay.processed(receiptId));
    }

    function testRejectsReceiptReplay() public {
        bytes32 receiptId = _challengeReceipt();
        DonstraSettlementRelay.Settlement memory settlement = _settlement(receiptId);
        bytes[] memory signatures = new bytes[](1);
        signatures[0] = _sign(REPORTER_KEY, relay.settlementDigest(settlement));
        relay.settle(settlement, signatures);

        (bool ok,) = address(relay).call(abi.encodeCall(DonstraSettlementRelay.settle, (settlement, signatures)));
        assert(!ok);
    }

    function testRequiresConfiguredTwoOfThreeQuorum() public {
        uint256 secondKey = 0xB0B;
        uint256 thirdKey = 0xCAFE;
        address[] memory reporters = new address[](3);
        reporters[0] = vm.addr(REPORTER_KEY);
        reporters[1] = vm.addr(secondKey);
        reporters[2] = vm.addr(thirdKey);
        DonstraSettlementRelay quorumRelay = new DonstraSettlementRelay(
            address(0x1234),
            keccak256("genlayer-studionet"),
            reporters,
            2,
            1 days,
            AGENT_BOND,
            CHALLENGE_BOND,
            1 days,
            2 days
        );
        DonstraRegistry quorumRegistry = quorumRelay.registry();
        bytes32 receiptId = keccak256("quorum-receipt");
        bytes memory data = abi.encodeCall(RelayCounter.set, (42));
        uint64 deadline = uint64(block.timestamp + 1 hours);
        bytes32 actionDigest = keccak256(abi.encode(block.chainid, address(counter), 0, keccak256(data), deadline));
        quorumRegistry.commit{value: AGENT_BOND}(receiptId, keccak256("testimony"), actionDigest, deadline);
        quorumRegistry.execute(receiptId, address(counter), 0, data, deadline);
        quorumRegistry.challenge{value: CHALLENGE_BOND}(receiptId);
        DonstraSettlementRelay.Settlement memory settlement = DonstraSettlementRelay.Settlement({
            receiptId: receiptId,
            adjudicationTxHash: keccak256("quorum-transaction"),
            verdict: uint8(DonstraRegistry.Verdict.Reasonable),
            adjudicatedAt: uint64(block.timestamp),
            validUntil: uint64(block.timestamp + 1 hours)
        });
        bytes32 digest = quorumRelay.settlementDigest(settlement);
        bytes[] memory insufficient = new bytes[](1);
        insufficient[0] = _sign(REPORTER_KEY, digest);
        (bool ok,) =
            address(quorumRelay).call(abi.encodeCall(DonstraSettlementRelay.settle, (settlement, insufficient)));
        assert(!ok);

        bytes[] memory sufficient = new bytes[](2);
        if (vm.addr(REPORTER_KEY) < vm.addr(secondKey)) {
            sufficient[0] = _sign(REPORTER_KEY, digest);
            sufficient[1] = _sign(secondKey, digest);
        } else {
            sufficient[0] = _sign(secondKey, digest);
            sufficient[1] = _sign(REPORTER_KEY, digest);
        }
        quorumRelay.settle(settlement, sufficient);
        assert(quorumRelay.processed(receiptId));
    }

    function _challengeReceipt() private returns (bytes32 receiptId) {
        receiptId = keccak256("relay-receipt");
        bytes memory data = abi.encodeCall(RelayCounter.set, (42));
        uint64 deadline = uint64(block.timestamp + 1 hours);
        bytes32 actionDigest = keccak256(abi.encode(block.chainid, address(counter), 0, keccak256(data), deadline));
        registry.commit{value: AGENT_BOND}(receiptId, keccak256("testimony"), actionDigest, deadline);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        registry.challenge{value: CHALLENGE_BOND}(receiptId);
    }

    function _sign(uint256 key, bytes32 digest) private returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);
        return abi.encodePacked(r, s, v);
    }

    function _settlement(bytes32 receiptId) private view returns (DonstraSettlementRelay.Settlement memory) {
        return DonstraSettlementRelay.Settlement({
            receiptId: receiptId,
            adjudicationTxHash: keccak256("genlayer-transaction"),
            verdict: uint8(DonstraRegistry.Verdict.Reasonable),
            adjudicatedAt: uint64(block.timestamp),
            validUntil: uint64(block.timestamp + 1 hours)
        });
    }
}
