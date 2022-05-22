require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const util = require("util");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const saltRounds = 10;

const { encrypt, decrypt } = require("./EncryptionHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

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
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
});

// node native promisify
const query = util.promisify(db.query).bind(db);

app.get('/confirmation/:token', (req, res) => {
    try {
        jwt.verify(
            req.params.token,
            process.env.EMAIL_SECRET,
            (err, decoded) => {
                db.query("UPDATE users SET email_verified_at=CURRENT_TIMESTAMP WHERE id=?", decoded.user);
                res.send('Your account has been verified.');
            }
        );
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/reset/:token', async (req, res) => {
    try {
        jwt.verify(
            req.params.token,
            process.env.EMAIL_SECRET,
            async (err, decoded) => {
                const hashedPwd = await bcrypt.hash(decoded.password, saltRounds);
                await query("UPDATE users SET password=? WHERE id=?", [hashedPwd, decoded.user]);
                res.send('Your password has been reset.');
            }
        );
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/forgot', async (req, res) => {
    try {
        const users = await query("SELECT * FROM users WHERE email=?", req.body.email);
        if (!(users.length > 0)) return res.sendStatus(401); // user does not exist
        const foundUser = { ...users[0] };
        if (!foundUser.email_verified_at) return res.sendStatus(403); // email not verified
        
        const emailToken = jwt.sign(
            {
                user: foundUser.id,
                password: req.body.pwd
            },
            process.env.EMAIL_SECRET,
            { expiresIn: '1d', }
        );
        const url = `${process.env.APP_URL}/reset/${emailToken}`;
        transporter.sendMail({
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to: foundUser.email,
            subject: 'Reset Password',
            html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
        });

        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/register", async (req, res) => {
    try {
        const { email, pwd } = req.body;
        if (!email || !pwd) return res.sendStatus(400);
        const hashedPwd = await bcrypt.hash(pwd, saltRounds);
        const result = await query("INSERT INTO users (email, password) VALUES (?,?)", [email, hashedPwd]);
        
        const emailToken = jwt.sign(
            { user: result.insertId },
            process.env.EMAIL_SECRET,
            { expiresIn: '1d', }
        );
        const url = `${process.env.APP_URL}/confirmation/${emailToken}`;
        transporter.sendMail({
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Confirm Email',
            html: `Please click this link to confirm your account: <a href="${url}">${url}</a>`
        });

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
        if (!foundUser.email_verified_at) return res.sendStatus(403); // email not verified

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            // create JWTs
            const accessToken = jwt.sign(
                {
                    "id": foundUser.id,
                    "password": foundUser.password
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );
            const refreshToken = jwt.sign(
                {
                    "id": foundUser.id,
                    "password": foundUser.password
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            await query("UPDATE users SET refresh_token=? WHERE id=?", [refreshToken, foundUser.id]);

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            
            // Send access token to user
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
        await query("INSERT INTO logins (title, username, password, website, note, prompt, iv, user) VALUES (?,?,?,?,?,?,?,?)", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv, user]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addcard", async (req, res) => {
    const { user, title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("INSERT INTO cards (title, name, number, month, year, cvv, note, prompt, user) VALUES (?,?,?,?,?,?,?,?,?)", [title, name, number, month, year, cvv, note, prompt, user]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addnote", async (req, res) => {
    const { user, title, note, prompt } = req.body;
    try {
        await query("INSERT INTO notes (title, note, prompt, user) VALUES (?,?,?,?)", [title, note, prompt, user]);
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
        await query("UPDATE logins SET title=?, username=?, password=?, website=?, note=?, prompt=?, iv=? WHERE id=?", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv, id]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatecard/:id", async (req, res) => {
    const id = req.params.id;
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("UPDATE cards SET title=?, name=?, number=?, month=?, year=?, cvv=?, note=?, prompt=? WHERE id=?", [title, name, number, month, year, cvv, note, prompt, id]);
        res.send("Success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatenote/:id", async (req, res) => {
    const id = req.params.id;
    const { title, note, prompt } = req.body;
    try {
        await query("UPDATE notes SET title=?, note=?, prompt=? WHERE id=?", [title, note, prompt, id]);
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

app.listen(process.env.APP_PORT, () => {
    console.log("Server is running");
});