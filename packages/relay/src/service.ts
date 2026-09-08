#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { isHex } from "viem";
import { attestFinalizedReceipt } from "./attest.js";
import { loadRelayConfig } from "./config.js";
import type { Hex } from "./types.js";

const config = loadRelayConfig();
const token = process.env.OPERATOR_API_TOKEN?.trim() ?? "";
const port = Number(process.env.OPERATOR_PORT ?? "8787");
const maxConcurrent = Number(process.env.OPERATOR_MAX_CONCURRENT ?? "4");
if (token.length < 32) throw new Error("OPERATOR_API_TOKEN must contain at least 32 characters");
if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw new Error("Invalid OPERATOR_PORT");
if (!Number.isSafeInteger(maxConcurrent) || maxConcurrent < 1 || maxConcurrent > 32) throw new Error("Invalid OPERATOR_MAX_CONCURRENT");

let active = 0;

function json(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
  response.end(`${JSON.stringify(body)}\n`);
}

function authorized(request: IncomingMessage): boolean {
  const supplied = request.headers.authorization?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBytes = Buffer.from(token);
  const suppliedBytes = Buffer.from(supplied);
  return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

async function body(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes = Buffer.from(chunk);
    size += bytes.length;
    if (size > 8_192) throw new Error("Request body exceeds 8KB");
    chunks.push(bytes);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function hex32(value: unknown, field: string): Hex {
  if (typeof value !== "string" || !isHex(value) || value.length !== 66) throw new Error(`${field} must be 32 bytes`);
  return value as Hex;
}

const server = createServer(async (request, response) => {
  const requestId = request.headers["x-request-id"]?.toString().slice(0, 128) ?? randomUUID();
  try {
    if (request.method === "GET" && request.url === "/healthz") return json(response, 200, { ok: true, active });
    if (request.method !== "POST" || request.url !== "/v1/attest") return json(response, 404, { error: "not_found", requestId });
    if (!authorized(request)) return json(response, 401, { error: "unauthorized", requestId });
    if (active >= maxConcurrent) return json(response, 503, { error: "busy", requestId });
    const input = await body(request) as Record<string, unknown>;
    const receiptId = hex32(input.receiptId, "receiptId");
    const adjudicationTxHash = hex32(input.adjudicationTxHash, "adjudicationTxHash");
    active += 1;
    try {
      const artifact = await attestFinalizedReceipt(config, receiptId, adjudicationTxHash);
      process.stdout.write(`${JSON.stringify({ level: "info", event: "attested", requestId, receiptId, signer: artifact.signer })}\n`);
      return json(response, 200, artifact);
    } finally { active -= 1; }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected operator error";
    process.stderr.write(`${JSON.stringify({ level: "error", event: "request_failed", requestId, detail })}\n`);
    return json(response, 400, { error: "attestation_failed", requestId });
  }
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(`${JSON.stringify({ level: "info", event: "listening", port })}\n`);
});

function shutdown(signal: string): void {
  process.stdout.write(`${JSON.stringify({ level: "info", event: "shutdown", signal, active })}\n`);
  server.close((error) => process.exit(error ? 1 : 0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
