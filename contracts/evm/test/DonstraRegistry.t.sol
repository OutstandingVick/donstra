// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraRegistry} from "../src/DonstraRegistry.sol";

contract Counter {
    uint256 public value;
    function set(uint256 next) external { value = next; }
}

contract DonstraRegistryTest {
    DonstraRegistry private registry;
    Counter private counter;

    function setUp() public {
        registry = new DonstraRegistry(address(this));
        counter = new Counter();
    }

    function testExecutesOnlyCommittedAction() public {
        bytes32 receiptId = keccak256("receipt-1");
        bytes memory data = abi.encodeCall(Counter.set, (42));
        uint64 deadline = uint64(block.timestamp + 100);
        bytes32 actionDigest = keccak256(abi.encode(block.chainid, address(counter), 0, keccak256(data), deadline));
        registry.commit(receiptId, keccak256("testimony"), actionDigest, deadline);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        assert(counter.value() == 42);
    }

    function testRejectsDifferentCalldata() public {
        bytes32 receiptId = keccak256("receipt-2");
        bytes memory committedData = abi.encodeCall(Counter.set, (42));
        bytes memory differentData = abi.encodeCall(Counter.set, (99));
        uint64 deadline = uint64(block.timestamp + 100);
        bytes32 actionDigest = keccak256(abi.encode(block.chainid, address(counter), 0, keccak256(committedData), deadline));
        registry.commit(receiptId, keccak256("testimony"), actionDigest, deadline);
        (bool ok,) = address(registry).call(
            abi.encodeCall(DonstraRegistry.execute, (receiptId, address(counter), 0, differentData, deadline))
        );
        assert(!ok);
        assert(counter.value() == 0);
    }

    function testCompletesChallengeLifecycle() public {
        bytes32 receiptId = keccak256("receipt-3");
        bytes memory data = abi.encodeCall(Counter.set, (7));
        uint64 deadline = uint64(block.timestamp + 100);
        bytes32 actionDigest = keccak256(abi.encode(block.chainid, address(counter), 0, keccak256(data), deadline));
        registry.commit(receiptId, keccak256("testimony"), actionDigest, deadline);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        registry.challenge(receiptId);
        registry.resolve(receiptId, DonstraRegistry.Verdict.Reasonable);
        (,,,,,,, DonstraRegistry.Status status) = registry.commitments(receiptId);
        assert(status == DonstraRegistry.Status.Resolved);
    }
}
