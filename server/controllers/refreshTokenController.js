const jwt = require('jsonwebtoken');
require('dotenv').config();
const mysql = require("mysql");
const util = require('util');
const db = mysql.createConnection({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
// node native promisify
const query = util.promisify(db.query).bind(db);

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        // console.log(cookies.jwt);
        const refreshToken = cookies.jwt;

        const users = await query("SELECT * FROM users WHERE refresh_token=?", refreshToken);
        if (!(users.length > 0)) return res.sendStatus(403); // Forbidden
        const foundUser = { ...users[0] };

        // evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.id !== decoded.id) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    {
                        "id": decoded.id,
                        "password": decoded.password
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '5m' }
                );
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

module.exports = { handleRefreshToken }