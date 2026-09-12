import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/**
 * SIMULATED application-level AES-256-GCM.
 * Production must load the key from a KMS — this constant is a demo stand-in
 * and is not a secret.
 */
const DEMO_KMS_MATERIAL = "surakshanet-simulated-kms-material-v1";

function key(): Buffer {
  return scryptSync(DEMO_KMS_MATERIAL, "suraksha-salt", 32);
}

export function encryptField(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

export function decryptField(blob: string): string {
  if (!blob.startsWith("enc:v1:")) throw new Error("Unknown ciphertext");
  const [, , ivB, tagB, dataB] = blob.split(":");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB, "base64"));
  decipher.setAuthTag(Buffer.from(tagB, "base64"));
  const out = Buffer.concat([
    decipher.update(Buffer.from(dataB, "base64")),
    decipher.final(),
  ]);
  return out.toString("utf8");
}
