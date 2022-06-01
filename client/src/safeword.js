const crypto = require("crypto");

const hash = (data, salt = "$2b$31$ZVHSM/d7RoeuOkx3IQc0iu", cost = 100000, digest = 'sha256') => {
  return new Promise((res, rej) => {
    crypto.pbkdf2(data, salt, cost, 16, digest, (err, key) => {
      err ? rej(err) : res(key.toString('hex'));
    });
  });
}

const encrypt = (data, secret) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secret), iv);

  const encryptedData = Buffer.concat([
    cipher.update(data),
    cipher.final(),
  ]);

  return Buffer.concat([iv,encryptedData]).toString("hex");
}
  
const decrypt = (data, secret) => {
  const encrypted = { iv: data.slice(0, 32), data: data.slice(32) };

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secret),
    Buffer.from(encrypted.iv, "hex")
  );

  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(encrypted.data, "hex")),
    decipher.final(),
  ]);

  return decryptedData.toString();
}

module.exports = { hash, encrypt, decrypt };