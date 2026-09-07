import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ExecutionResult,
  TransactionStatus,
  type DecodedDeployData,
  type GenLayerChain,
  type GenLayerClient,
  type TransactionHash,
} from "genlayer-js/types";

export default async function main(client: GenLayerClient<any>) {
  const code = new Uint8Array(readFileSync(resolve("contracts/genlayer/donstra_adjudicator.py")));
  await client.initializeConsensusSmartContract();
  const hash = await client.deployContract({ code, args: [] });
  const receipt = await client.waitForTransactionReceipt({
    hash: hash as TransactionHash,
    status: TransactionStatus.ACCEPTED,
    retries: 200,
  });
  if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) {
    throw new Error(`Deployment execution failed: ${hash}`);
  }
  const address = receipt.data?.contract_address ?? (receipt.txDataDecoded as DecodedDeployData)?.contractAddress;
  if (!address) throw new Error(`Deployment produced no contract address on ${(client.chain as GenLayerChain).name}`);
  console.log(JSON.stringify({
    network: (client.chain as GenLayerChain).name,
    contractAddress: address,
    transactionHash: hash,
    status: receipt.statusName,
  }, null, 2));
}
