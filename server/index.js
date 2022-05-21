const express = require("express");
const app = express();
const mysql = require("mysql");
const util = require('util');
const cors = require("cors");
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const PORT = 3001;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
require('dotenv').config();

const { encrypt, decrypt } = require("./EncryptionHandler");
const { response } = require("express");

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// build-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// node native promisify
const query = util.promisify(db.query).bind(db);

app.post("/register", async (req, res) => {
    try {
        const { email, pwd } = req.body;
        if (!email || !phone || !pwd) return res.sendStatus(400);
        const hashedPwd = await bcrypt.hash(pwd, saltRounds);
        const result = await query("INSERT INTO users (email, password, created_at, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [email, hashedPwd]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/auth", async (req, res) => {
    try {
        const { email, pwd } = req.body;
        if (!email || !pwd) return res.sendStatus(400);
            
        const users = await query("SELECT * FROM users WHERE email=?", email);
        if (!(users.length > 0)) return res.sendStatus(401); // user does not exist

        const foundUser = { ...users[0] };
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            // create JWTs
            const accessToken = jwt.sign(
                {
                    "id": foundUser.id,
                    "email": foundUser.email,
                    "password": foundUser.password
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );
            const refreshToken = jwt.sign(
                {
                    "id": foundUser.id,
                    "email": foundUser.email,
                    "password": foundUser.password
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            await query("UPDATE users SET refresh_token=? WHERE id=?", [refreshToken, foundUser.id]);

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            
            // Send authorization info and access token to user
            res.send({ accessToken });
        } else {
            // incorrect password
            res.sendStatus(401);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);

app.post("/showlogins", async (req, res) => {
    try {
        const result = await query("SELECT * FROM logins WHERE user=?", req.body.user);
        res.send(result);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/showcards", async (req, res) => {
    try {
        const result = await query("SELECT * FROM cards WHERE user=?", req.body.user);
        res.send(result);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/shownotes", async (req, res) => {
    try {
        const result = await query("SELECT * FROM notes WHERE user=?", req.body.user);
        res.send(result);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addlogin", async (req, res) => {
    const { user, title, username, password, website, note, prompt, iv } = req.body;
    const hashedPassword = encrypt(password);
    try {
        await query("INSERT INTO logins (title, username, password, website, note, prompt, iv, user, created_at, updated_at) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv, user]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addcard", async (req, res) => {
    const { user, title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("INSERT INTO cards (title, name, number, month, year, cvv, note, prompt, user, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [title, name, number, month, year, cvv, note, prompt, user]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addnote", async (req, res) => {
    const { user, title, note, prompt } = req.body;
    try {
        await query("INSERT INTO notes (title, note, prompt, user, created_at, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [title, note, prompt, user]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatelogin/:id", async (req, res) => {
    const id = req.params.id;
    const { title, username, password, website, note, prompt } = req.body;
    const hashedPassword = encrypt(password);
    try {
        await query("UPDATE logins SET title=?, username=?, password=?, website=?, note=?, prompt=?, iv=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv, id]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatecard/:id", async (req, res) => {
    const id = req.params.id;
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("UPDATE cards SET title=?, name=?, number=?, month=?, year=?, cvv=?, note=?, prompt=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [title, name, number, month, year, cvv, note, prompt, id]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatenote/:id", async (req, res) => {
    const id = req.params.id;
    const { title, note, prompt } = req.body;
    try {
        await query("UPDATE notes SET title=?, note=?, prompt=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [title, note, prompt, id]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/deletelogin/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM logins WHERE id=?", id);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/deletecard/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM cards WHERE id=?", id);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/deletenote/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM notes WHERE id=?", id);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.listen(PORT, () => {
    console.log("Server is running");
});