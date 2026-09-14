# Live acceptance cases

The production candidate is accepted only after all four cases are executed
against the published Studionet adjudicator and Sepolia registry. Record every
transaction in the deployment record; screenshots alone are not evidence.

## Reasonable

Commit a testimony whose proposed exposure is within its stated mandate, bind
the exact executed action, challenge it, and relay a 2-of-3 reporter settlement.
Expected result: `Reasonable`, with the agent bond and challenge bond claimable
by the agent.

## Negligent

Commit a testimony whose proposed exposure exceeds its stated mandate, bind the
exact executed action, challenge it, and relay the validator result. Expected
result: `Negligent`, with both bonds claimable by the challenger.

## Fabricated

Commit one testimony digest, then disclose altered testimony for adjudication.
The changed content must not be accepted as the committed receipt. Expected
result: `Fabricated` and challenger recovery on the EVM registry.

## Timeout

Commit and execute a receipt, open a challenge, submit no settlement, advance
past `adjudicationWindow`, and call `expireChallenge`. Expected result:
`Inconclusive`, returning each party's own bond through pull-based withdrawals.

## Evidence captured for every case

- Receipt ID and testimony/action digests
- Commitment, execution, challenge, and resolution transaction hashes
- Finalized GenLayer adjudication transaction where applicable
- Two ordered reporter addresses and signatures used for settlement
- Final registry status, verdict, and claimable balances
- Explorer links and UTC timestamps
