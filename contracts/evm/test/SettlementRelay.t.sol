// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraRegistry} from "../src/DonstraRegistry.sol";
import {DonstraSettlementRelay} from "../src/DonstraSettlementRelay.sol";

interface Vm {
    function addr(uint256 privateKey) external returns (address);
    function sign(uint256 privateKey, bytes32 digest) external returns (uint8 v, bytes32 r, bytes32 s);
    function warp(uint256 timestamp) external;
}

contract RelayCounter {
    uint256 public value;
    function set(uint256 next) external { value = next; }
}

contract SettlementRelayTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    uint256 private constant REPORTER_KEY = 0xA11CE;

    DonstraSettlementRelay private relay;
    DonstraRegistry private registry;
    RelayCounter private counter;

    function setUp() public {
        vm.warp(1_700_000_000);
        address[] memory reporters = new address[](1);
        reporters[0] = vm.addr(REPORTER_KEY);
        relay = new DonstraSettlementRelay(
            address(0x1234), keccak256("genlayer-testnet-bradbury"), reporters, 1, 1 days
        );
        registry = relay.registry();
        counter = new RelayCounter();
    }

    function testRelaysSignedVerdictIntoRegistry() public {
        bytes32 receiptId = _challengeReceipt();
        DonstraSettlementRelay.Settlement memory settlement = DonstraSettlementRelay.Settlement({
            receiptId: receiptId,
            adjudicationTxHash: keccak256("genlayer-transaction"),
            verdict: uint8(DonstraRegistry.Verdict.Reasonable),
            adjudicatedAt: uint64(block.timestamp),
            validUntil: uint64(block.timestamp + 1 hours)
        });

        bytes[] memory signatures = new bytes[](1);
        signatures[0] = _sign(REPORTER_KEY, relay.settlementDigest(settlement));
        relay.settle(settlement, signatures);

        (,,,,,,,, DonstraRegistry.Status status) = registry.commitments(receiptId);
        assert(status == DonstraRegistry.Status.Resolved);
        assert(relay.processed(receiptId));
    }

    function _challengeReceipt() private returns (bytes32 receiptId) {
        receiptId = keccak256("relay-receipt");
        bytes memory data = abi.encodeCall(RelayCounter.set, (42));
        uint64 deadline = uint64(block.timestamp + 1 hours);
        bytes32 actionDigest = keccak256(
            abi.encode(block.chainid, address(counter), 0, keccak256(data), deadline)
        );
        registry.commit(receiptId, keccak256("testimony"), actionDigest, deadline);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        registry.challenge(receiptId);
    }

    function _sign(uint256 key, bytes32 digest) private returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);
        return abi.encodePacked(r, s, v);
    }
}
