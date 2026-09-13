import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/crypto-D95s8H0H.js
/**
* SIMULATED application-level AES-256-GCM.
* Production must load the key from a KMS — this constant is a demo stand-in
* and is not a secret.
*/
var DEMO_KMS_MATERIAL = "surakshanet-simulated-kms-material-v1";
function key() {
	return scryptSync(DEMO_KMS_MATERIAL, "suraksha-salt", 32);
}
function encryptField(plain) {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key(), iv);
	const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return `enc:v1:${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}
function decryptField(blob) {
	if (!blob.startsWith("enc:v1:")) throw new Error("Unknown ciphertext");
	const [, , ivB, tagB, dataB] = blob.split(":");
	const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB, "base64"));
	decipher.setAuthTag(Buffer.from(tagB, "base64"));
	return Buffer.concat([decipher.update(Buffer.from(dataB, "base64")), decipher.final()]).toString("utf8");
}
//#endregion
export { decryptField, encryptField };
