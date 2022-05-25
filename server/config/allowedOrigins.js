require('dotenv').config();

const allowedOrigins = [
    process.env.APP_URL,
    'http://localhost:3000',
    'chrome-extension://iobpfjopobpdknpjebgdiokphkjpjfep',
    'chrome-extension://ddllpomgmhdlmaobdcmcneglbgjccjai',
];

module.exports = allowedOrigins;