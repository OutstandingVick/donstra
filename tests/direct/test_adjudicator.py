import json
import pytest


REASONABLE = json.dumps({
    "verdict": "GENUINE_REASONABLE",
    "future_knowledge": False,
    "confidence_bps": 8700,
    "reason": "Evidence supports the action within the mandate.",
})


def test_adjudicates_and_stores_verdict(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    result = contract.adjudicate(
        "0xreceipt", "1700000000", '{"belief":"stable pool"}', '{"apy":18}'
    )
    assert result["verdict"] == "GENUINE_REASONABLE"
    assert contract.get_verdict("0xreceipt")["future_knowledge"] is False


def test_validator_independently_checks_decision(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    contract.adjudicate("0xreceipt", "1700000000", "{}", "{}")
    direct_vm.clear_mocks()
    direct_vm.mock_llm(r".*", json.dumps({
        "verdict": "GENUINE_NEGLIGENT",
        "future_knowledge": True,
        "confidence_bps": 9000,
        "reason": "The action relies on future evidence.",
    }))
    assert direct_vm.run_validator() is False


def test_receipt_cannot_be_adjudicated_twice(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    contract.adjudicate("0xreceipt", "1700000000", "{}", "{}")
    with pytest.raises(Exception, match="already adjudicated"):
        contract.adjudicate("0xreceipt", "1700000000", "{}", "{}")

