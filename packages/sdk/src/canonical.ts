import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import type { Hex, ProposedAction, TestimonyPayload } from "./types.js";

const DOMAIN = "DONSTRA_TESTIMONY_V1";
const ACTION_DOMAIN = "DONSTRA_ACTION_V1";
const RECEIPT_DOMAIN = "DONSTRA_RECEIPT_V1";

function normalize(value: unknown): unknown {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Canonical values must contain finite numbers");
    return value;
  }
  if (Array.isArray(value)) return value.map(normalize);
  if (typeof value === "object") {
    const source = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(source)
        .sort()
        .map((key) => {
          if (source[key] === undefined) throw new TypeError(`Undefined value at ${key}`);
          return [key, normalize(source[key])];
        }),
    );
  }
  throw new TypeError(`Unsupported canonical value: ${typeof value}`);
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(normalize(value));
}

export function digest(domain: string, value: unknown): Hex {
  const message = `${domain}\n${canonicalize(value)}`;
  return `0x${bytesToHex(sha256(utf8ToBytes(message)))}`;
}

export function hashTestimony(payload: TestimonyPayload): Hex {
  return digest(DOMAIN, payload);
}

export function hashAction(action: ProposedAction): Hex {
  return digest(ACTION_DOMAIN, action);
}

export function deriveReceiptId(agent: string, nonce: string): Hex {
  return digest(RECEIPT_DOMAIN, { agent: agent.toLowerCase(), nonce });
}
