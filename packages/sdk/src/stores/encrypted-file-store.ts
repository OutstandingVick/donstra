import { promises as fs } from "node:fs";
import path from "node:path";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { Hex, SealedEnvelope, TestimonyPayload, TestimonyStore } from "../types.js";
import { assertHex32 } from "../validation.js";

export class EncryptedFileStore implements TestimonyStore {
  constructor(private readonly directory: string, private readonly key: Uint8Array) {
    if (key.byteLength !== 32) throw new TypeError("EncryptedFileStore requires a 32-byte key");
  }

  private filename(receiptId: Hex): string {
    assertHex32(receiptId, "receiptId");
    return path.join(this.directory, `${receiptId.slice(2)}.sealed.json`);
  }

  async put(receiptId: Hex, payload: TestimonyPayload): Promise<void> {
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 });
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    cipher.setAAD(Buffer.from(receiptId));
    const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
    const envelope: SealedEnvelope = {
      version: 1,
      algorithm: "AES-256-GCM",
      iv: iv.toString("base64"),
      ciphertext: ciphertext.toString("base64"),
      authTag: cipher.getAuthTag().toString("base64"),
    };
    await fs.writeFile(this.filename(receiptId), JSON.stringify(envelope), { flag: "wx", mode: 0o600 });
  }

  async get(receiptId: Hex): Promise<TestimonyPayload | null> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filename(receiptId), "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
    const envelope = JSON.parse(raw) as SealedEnvelope;
    if (envelope.version !== 1 || envelope.algorithm !== "AES-256-GCM") throw new Error("Unsupported sealed envelope");
    const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(envelope.iv, "base64"));
    decipher.setAAD(Buffer.from(receiptId));
    decipher.setAuthTag(Buffer.from(envelope.authTag, "base64"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, "base64")),
      decipher.final(),
    ]);
    return JSON.parse(plaintext.toString("utf8")) as TestimonyPayload;
  }

  async delete(receiptId: Hex): Promise<void> {
    try { await fs.unlink(this.filename(receiptId)); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}
