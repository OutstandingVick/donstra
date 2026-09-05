# Donstra EVM registry

The registry is the deterministic half of Donstra. It timestamps commitments,
escrows bonds, and acts as the executor so a receipt cannot be attached to a
different transaction after the fact.

`actionDigest` is `keccak256(abi.encode(chainid, target, value,
keccak256(calldata), deadline))`.
