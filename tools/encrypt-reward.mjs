// =====================================================================
//  encrypt-reward.mjs — arm the PDF CTF.
//
//  Usage:   node tools/encrypt-reward.mjs
//
//  Asks for (1) your flag and (2) the reward message solvers see.
//  Prints the two values to paste into src/data.js → terminalConfig.pdfCtf,
//  then set  enabled: true.
//
//  Scheme (matches the browser exactly):
//    key        = SHA-256(flag)                → AES-256-GCM key
//    ciphertext = base64( iv(12) || ct || tag )
//  The reward is unreadable in your source until someone solves the PDF.
// =====================================================================
import crypto from "node:crypto";
import readline from "node:readline/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const flag = (await rl.question("Flag (e.g. flag{...}): ")).trim();
console.log("Reward message (multi-line; finish with an empty line):");
const lines = [];
for (;;) {
  const l = await rl.question("");
  if (l === "") break;
  lines.push(l);
}
rl.close();

const reward = lines.join("\n") || "Congratulations, solver. Abiral owes you a coffee.";
const key = crypto.createHash("sha256").update(flag, "utf8").digest();
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
const ct = Buffer.concat([cipher.update(reward, "utf8"), cipher.final()]);
const payload = Buffer.concat([iv, ct, cipher.getAuthTag()]).toString("base64");
const flagHash = crypto.createHash("sha256").update(flag, "utf8").digest("hex");

console.log("\nPaste into src/data.js → terminalConfig.pdfCtf:\n");
console.log(`  enabled: true,`);
console.log(`  flagSha256: "${flagHash}",`);
console.log(`  encryptedReward: "${payload}",`);
console.log("\nThen drop your PDF at public/challenge.pdf and redeploy.");
