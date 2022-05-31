const crypto = require("crypto");
const secret = process.env.AES_SECRET_KEY; // require('crypto').randomBytes(16).toString('hex')

const encrypt = (data) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);

  const encryptedData = Buffer.concat([
    cipher.update(data),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    data: encryptedData.toString("hex"),
  };
};

const decrypt = (data) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(secret),
    Buffer.from(data.iv, "hex")
  );

  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(data.data, "hex")),
    decipher.final(),
  ]);

  return decryptedData.toString();
};

module.exports = { encrypt, decrypt };
