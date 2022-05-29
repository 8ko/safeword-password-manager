const crypto = require("crypto");
const secret = process.env.AES_SECRET_KEY; // require('crypto').randomBytes(16).toString('hex')

const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);

  const encryptedData = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    data: encryptedData.toString("hex"),
  };
};

const decrypt = (encryption) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(secret),
    Buffer.from(encryption.iv, "hex")
  );

  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(encryption.data, "hex")),
    decipher.final(),
  ]);

  return decryptedData.toString();
};

module.exports = { encrypt, decrypt };
