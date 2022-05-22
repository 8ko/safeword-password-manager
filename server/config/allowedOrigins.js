require('dotenv').config();

const allowedOrigins = [
    process.env.APP_URL,
    'http://localhost:3000',
];

module.exports = allowedOrigins;