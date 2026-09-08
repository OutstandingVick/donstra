// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraRegistry} from "../src/DonstraRegistry.sol";

interface Vm {
    function deal(address account, uint256 balance) external;
    function warp(uint256 timestamp) external;
}

contract Counter {
    uint256 public value;

    function set(uint256 next) external payable {
        value = next;
    }
}

contract DonstraRegistryTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    uint96 private constant AGENT_BOND = 1 ether;
    uint96 private constant CHALLENGE_BOND = 0.1 ether;
    uint64 private constant CHALLENGE_WINDOW = 1 days;
    uint64 private constant ADJUDICATION_WINDOW = 2 days;

    DonstraRegistry private registry;
    Counter private counter;

    function setUp() public {
        registry = new DonstraRegistry(address(this), AGENT_BOND, CHALLENGE_BOND, CHALLENGE_WINDOW, ADJUDICATION_WINDOW);
        counter = new Counter();
        vm.deal(address(this), 10 ether);
    }

    function testExecutesOnlyCommittedAction() public {
        (bytes32 receiptId, bytes memory data, uint64 deadline) = _commit("receipt-1", 0);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        assert(counter.value() == 42);
    }

    function testRejectsDifferentCalldata() public {
        (bytes32 receiptId,, uint64 deadline) = _commit("receipt-2", 0);
        bytes memory differentData = abi.encodeCall(Counter.set, (99));
        (bool ok,) = address(registry)
            .call(abi.encodeCall(DonstraRegistry.execute, (receiptId, address(counter), 0, differentData, deadline)));
        assert(!ok);
        assert(counter.value() == 0);
    }

    function testActionCannotSpendEscrowedBonds() public {
        (bytes32 receiptId, bytes memory data, uint64 deadline) = _commit("receipt-value", 0.5 ether);
        (bool ok,) = address(registry)
            .call(abi.encodeCall(DonstraRegistry.execute, (receiptId, address(counter), 0.5 ether, data, deadline)));
        assert(!ok);
        registry.execute{value: 0.5 ether}(receiptId, address(counter), 0.5 ether, data, deadline);
        assert(address(counter).balance == 0.5 ether);
        assert(address(registry).balance == AGENT_BOND);
    }

    function testCompletesChallengeLifecycleWithPullPayment() public {
        (bytes32 receiptId, bytes memory data, uint64 deadline) = _commit("receipt-3", 0);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        registry.challenge{value: CHALLENGE_BOND}(receiptId);
        registry.resolve(receiptId, DonstraRegistry.Verdict.Reasonable);
        (,,,,,,,,,,, DonstraRegistry.Status status) = registry.commitments(receiptId);
        assert(status == DonstraRegistry.Status.Resolved);
        assert(registry.claimable(address(this)) == AGENT_BOND + CHALLENGE_BOND);
        uint256 before = address(this).balance;
        registry.withdraw(payable(address(this)));
        assert(address(this).balance == before + AGENT_BOND + CHALLENGE_BOND);
    }

    function testExpiredCommitmentCanBeCancelled() public {
        (bytes32 receiptId,, uint64 deadline) = _commit("receipt-expired", 0);
        vm.warp(uint256(deadline) + 1);
        registry.cancelExpired(receiptId);
        assert(registry.claimable(address(this)) == AGENT_BOND);
    }

    function testUnchallengedCommitmentCanFinalize() public {
        (bytes32 receiptId, bytes memory data, uint64 deadline) = _commit("receipt-final", 0);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        vm.warp(block.timestamp + CHALLENGE_WINDOW + 1);
        registry.finalizeUnchallenged(receiptId);
        assert(registry.claimable(address(this)) == AGENT_BOND);
    }

    function testTimedOutChallengeRefundsBothBonds() public {
        (bytes32 receiptId, bytes memory data, uint64 deadline) = _commit("receipt-timeout", 0);
        registry.execute(receiptId, address(counter), 0, data, deadline);
        registry.challenge{value: CHALLENGE_BOND}(receiptId);
        vm.warp(block.timestamp + ADJUDICATION_WINDOW + 1);
        registry.expireChallenge(receiptId);
        assert(registry.claimable(address(this)) == AGENT_BOND + CHALLENGE_BOND);
    }

    function _commit(string memory label, uint256 actionValue)
        private
        returns (bytes32 receiptId, bytes memory data, uint64 deadline)
    {
        receiptId = keccak256(bytes(label));
        data = abi.encodeCall(Counter.set, (42));
        deadline = uint64(block.timestamp + 100);
        bytes32 actionDigest =
            keccak256(abi.encode(block.chainid, address(counter), actionValue, keccak256(data), deadline));
        registry.commit{value: AGENT_BOND}(receiptId, keccak256("testimony"), actionDigest, deadline);
    }

    receive() external payable {}
}
