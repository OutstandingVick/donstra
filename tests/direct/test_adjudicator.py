import hashlib
import json
import pytest


REASONABLE = json.dumps({
    "verdict": "GENUINE_REASONABLE",
    "future_knowledge": False,
    "confidence_bps": 8700,
    "reason": "Evidence supports the action within the mandate.",
})


def testimony():
    return {
        "schema": "donstra.testimony.v1",
        "agent": "0x1111111111111111111111111111111111111111",
        "nonce": "test-1",
        "proposedAction": {"kind": "allocate", "target": "vault"},
        "belief": "stable pool",
    }


def digest(domain, value):
    canonical = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return "0x" + hashlib.sha256((domain + "\n" + canonical).encode()).hexdigest()


def receipt_id(payload):
    return digest("DONSTRA_RECEIPT_V1", {"agent": payload["agent"].lower(), "nonce": payload["nonce"]})


def test_adjudicates_and_stores_verdict(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    payload = testimony()
    receipt = receipt_id(payload)
    result = contract.adjudicate(receipt, "1700000000", json.dumps(payload), '{"apy":18}')
    assert result["verdict"] == "GENUINE_REASONABLE"
    assert result["testimony_digest"] == digest("DONSTRA_TESTIMONY_V1", payload)
    assert result["action_digest"] == digest("DONSTRA_ACTION_V1", payload["proposedAction"])
    assert contract.get_verdict(receipt)["future_knowledge"] is False


def test_validator_independently_checks_decision(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    payload = testimony()
    contract.adjudicate(receipt_id(payload), "1700000000", json.dumps(payload), "{}")
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
    payload = testimony()
    receipt = receipt_id(payload)
    contract.adjudicate(receipt, "1700000000", json.dumps(payload), "{}")
    with pytest.raises(Exception, match="already adjudicated"):
        contract.adjudicate(receipt, "1700000000", json.dumps(payload), "{}")


def test_rejects_receipt_not_derived_from_testimony(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    with pytest.raises(Exception, match="Receipt does not match testimony"):
        contract.adjudicate("0x" + "00" * 32, "1700000000", json.dumps(testimony()), "{}")


def test_receipt_case_cannot_be_used_to_shop_verdicts(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", REASONABLE)
    contract = direct_deploy("contracts/genlayer/donstra_adjudicator.py")
    payload = testimony()
    receipt = receipt_id(payload)
    contract.adjudicate(receipt.upper().replace("0X", "0x"), "1700000000", json.dumps(payload), "{}")
    with pytest.raises(Exception, match="already adjudicated"):
        contract.adjudicate(receipt, "1700000000", json.dumps(payload), "{}")
