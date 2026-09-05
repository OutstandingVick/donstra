# GenLayer adjudicator

`DonstraAdjudicator` handles only the subjective half of the protocol. Hash and
action authenticity are settled before this contract is called. Validators
independently evaluate the same timestamped testimony and evidence, then agree
on the decision fields while allowing prose and confidence to vary.

```bash
genvm-lint check contracts/genlayer/donstra_adjudicator.py
```
