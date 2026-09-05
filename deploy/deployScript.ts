import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TransactionStatus, type GenLayerChain, type GenLayerClient, type TransactionHash } from "genlayer-js/types";

export default async function main(client: GenLayerClient<any>) {
  const code = new Uint8Array(readFileSync(resolve("contracts/genlayer/donstra_adjudicator.py")));
  await client.initializeConsensusSmartContract();
  const hash = await client.deployContract({ code, args: [] });
  const receipt = await client.waitForTransactionReceipt({
    hash: hash as TransactionHash,
    status: TransactionStatus.ACCEPTED,
    retries: 200,
  });
  const address = receipt.data?.contract_address ?? receipt.txDataDecoded?.contractAddress;
  if (!address) throw new Error(`Deployment produced no contract address on ${(client.chain as GenLayerChain).name}`);
  console.log(`DonstraAdjudicator deployed at ${address}`);
}
