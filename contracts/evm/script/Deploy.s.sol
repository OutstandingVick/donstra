// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DonstraSettlementRelay} from "../src/DonstraSettlementRelay.sol";

interface Vm {
    function envAddress(string calldata name, string calldata delimiter) external returns (address[] memory);
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
        address[] memory reporters = vm.envAddress("REPORTER_ADDRESSES", ",");
        uint256 configuredQuorum = vm.envUint("REPORTER_QUORUM");
        uint256 configuredMaxSourceAge = vm.envUint("MAX_SOURCE_AGE_SECONDS");
        uint256 configuredMinimumAgentBond = vm.envUint("MINIMUM_AGENT_BOND_WEI");
        uint256 configuredMinimumChallengeBond = vm.envUint("MINIMUM_CHALLENGE_BOND_WEI");
        uint256 configuredChallengeWindow = vm.envUint("CHALLENGE_WINDOW_SECONDS");
        uint256 configuredAdjudicationWindow = vm.envUint("ADJUDICATION_WINDOW_SECONDS");
        require(
            configuredQuorum > 0 && configuredQuorum <= reporters.length && configuredQuorum <= type(uint8).max,
            "invalid quorum"
        );
        require(configuredMaxSourceAge > 0 && configuredMaxSourceAge <= type(uint64).max, "invalid source age");
        require(configuredMinimumAgentBond > 0 && configuredMinimumAgentBond <= type(uint96).max, "invalid agent bond");
        require(
            configuredMinimumChallengeBond > 0 && configuredMinimumChallengeBond <= type(uint96).max,
            "invalid challenge bond"
        );
        require(
            configuredChallengeWindow > 0 && configuredChallengeWindow <= type(uint64).max, "invalid challenge window"
        );
        require(
            configuredAdjudicationWindow > 0 && configuredAdjudicationWindow <= type(uint64).max,
            "invalid adjudication window"
        );
        uint64 maxSourceAge = uint64(configuredMaxSourceAge);

        vm.startBroadcast();
        relay = new DonstraSettlementRelay(
            sourceContract,
            keccak256(bytes(sourceNetwork)),
            reporters,
            uint8(configuredQuorum),
            maxSourceAge,
            uint96(configuredMinimumAgentBond),
            uint96(configuredMinimumChallengeBond),
            uint64(configuredChallengeWindow),
            uint64(configuredAdjudicationWindow)
        );
        vm.stopBroadcast();
    }
}
