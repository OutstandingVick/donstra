// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraSettlementRelay} from "../src/DonstraSettlementRelay.sol";

interface Vm {
    function envAddress(string calldata name) external returns (address);
    function envString(string calldata name) external returns (string memory);
    function envUint(string calldata name) external returns (uint256);
    function startBroadcast() external;
    function stopBroadcast() external;
}

contract Deploy {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (DonstraSettlementRelay relay) {
        address sourceContract = vm.envAddress("GENLAYER_CONTRACT_ADDRESS");
        string memory sourceNetwork = vm.envString("GENLAYER_NETWORK");
        address reporter = vm.envAddress("REPORTER_ADDRESS");
        uint64 maxSourceAge = uint64(vm.envUint("MAX_SOURCE_AGE_SECONDS"));

        address[] memory reporters = new address[](1);
        reporters[0] = reporter;

        vm.startBroadcast();
        relay = new DonstraSettlementRelay(sourceContract, keccak256(bytes(sourceNetwork)), reporters, 1, maxSourceAge);
        vm.stopBroadcast();
    }
}
