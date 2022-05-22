const jwt = require('jsonwebtoken');
require('dotenv').config();
const mysql = require("mysql");
const db = mysql.createConnection({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        // is refreshToken in db?
        const users = db.query("SELECT * FROM users WHERE refresh_token=?", refreshToken);
        if (!(users.length > 0)) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }
        const foundUser = { ...users[0] };

        // delete refreshToken in db
        await query("UPDATE users SET refresh_token='' WHERE id=?", [foundUser.id]);
        
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true - only serves on https
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};

module.exports = { handleLogout }