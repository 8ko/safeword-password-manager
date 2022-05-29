require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const util = require("util");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const itexmo = require("./itexmo")({
    apiCode: process.env.ITEXMO_API_KEY,
    apiPwd: process.env.ITEXMO_PASSWORD
});
const saltRounds = 10;

const { encrypt, decrypt } = require("./EncryptionHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const hibp = require('hibp');

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
            process.env.EMAIL_TOKEN_SECRET,
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
            process.env.EMAIL_TOKEN_SECRET,
            async (err, decoded) => {
                const hashedPwd = await bcrypt.hash(decoded.password, saltRounds);
                // reset password and remove refresh token to log out of all devices
                await query("UPDATE users SET password=?, refresh_token='' WHERE id=?", [hashedPwd, decoded.user]);
                res.send('Your password has been reset.');
            }
        );
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/reset', async (req, res) => {
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
            process.env.EMAIL_TOKEN_SECRET,
            { expiresIn: '1d', }
        );
        const url = `${process.env.APP_URL}/reset/${emailToken}`;
        transporter.sendMail({
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to: foundUser.email,
            subject: '[SafeWord] Reset Password',
            html: `Please click this link to reset your password: <a href="${url}" target="_blank">${url}</a>`
        });

        res.send("success");
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
            process.env.EMAIL_TOKEN_SECRET,
            { expiresIn: '1d', }
        );
        const url = `${process.env.APP_URL}/confirmation/${emailToken}`;
        transporter.sendMail({
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: '[SafeWord] Confirm Account',
            html: `Please click this link to confirm your account: <a href="${url}">${url}</a>`
        });

        res.send("success");
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
                    "email": foundUser.email,
                    "password": foundUser.password
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );

            if (foundUser.tfa) {
                const code = parseInt(Math.random() * (999999 - 100000) + 100000).toString();
                await query("UPDATE users SET tfa_code=? WHERE id=?", [code, foundUser.id]);

                if (foundUser.tfa === 'email') {
                    transporter.sendMail({
                        from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
                        to: foundUser.email,
                        subject: '[SafeWord] Please verify your device',
                        html: `Please input this code in the SafeWord app to verify your login: <b>${code}</b>
                        <br>Do not share this code with anyone. If this request did not come from you, change your account password immediately
                        to prevent further unauthorized access.`
                    });
                } else if (foundUser.tfa === 'phone') {
                    itexmo.send({
                        to: foundUser.phone,
                        body: `Please input this code in the SafeWord app to verify your login: ${code}`
                    });
                }
            } else {
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
            }
            
            // Send access token to user
            res.send({ tfa: foundUser.tfa, accessToken });
        } else {
            // incorrect password
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/tfa/verify", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.sendStatus(400);
        const users = await query("SELECT * FROM users WHERE tfa_code=?", code);
        if (!(users.length > 0)) return res.sendStatus(401);
        await query("UPDATE users SET tfa_code='' WHERE tfa_code=?", [code]);
        const foundUser = { ...users[0] };
        if (!foundUser.email_verified_at) return res.sendStatus(403); // email not verified

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

        res.send("verified");
    } catch(err) {
        res.sendStatus(500);
    }
});

app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);

app.post("/hibp/account", async (req, res) => {
    hibp.search(req.body.acc, { apiKey: process.env.HIBP_API_KEY })
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.sendStatus(500);
    });
});

app.post("/hibp/password", async (req, res) => {
    hibp.pwnedPassword(req.body.pwd)
    .then(numPwns => {
        res.send({ pwns: numPwns});
    })
    .catch((err) => {
        res.sendStatus(500);
    });
});

app.get("/vault/:id", async (req, res) => {
    try {
        const user = req.params.id;
        const logins = await query("SELECT * FROM logins WHERE user=?", user);
        const cards = await query("SELECT * FROM cards WHERE user=?", user);
        const notes = await query("SELECT * FROM notes WHERE user=?", user);
        res.send({ logins, cards, notes });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/addlogin", async (req, res) => {
    const { user, title, username, password, website, note, prompt, iv } = req.body;
    const hashedPassword = encrypt(password);
    try {
        await query("INSERT INTO logins (title, username, password, website, note, prompt, iv, user) VALUES (?,?,?,?,?,?,?,?)", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv, user]);
        res.send("success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addcard", async (req, res) => {
    const { user, title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("INSERT INTO cards (title, name, number, month, year, cvv, note, prompt, user) VALUES (?,?,?,?,?,?,?,?,?)", [title, name, number, month, year, cvv, note, prompt, user]);
        res.send("success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/addnote", async (req, res) => {
    const { user, title, note, prompt } = req.body;
    try {
        await query("INSERT INTO notes (title, note, prompt, user) VALUES (?,?,?,?)", [title, note, prompt, user]);
        res.send("success");
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
        const logins = await query("SELECT * FROM logins WHERE id=?", id);
        res.send(logins[0]);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatecard/:id", async (req, res) => {
    const id = req.params.id;
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("UPDATE cards SET title=?, name=?, number=?, month=?, year=?, cvv=?, note=?, prompt=? WHERE id=?", [title, name, number, month, year, cvv, note, prompt, id]);
        const cards = await query("SELECT * FROM cards WHERE id=?", id);
        res.send(cards[0]);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/updatenote/:id", async (req, res) => {
    const id = req.params.id;
    const { title, note, prompt } = req.body;
    try {
        await query("UPDATE notes SET title=?, note=?, prompt=? WHERE id=?", [title, note, prompt, id]);
        const notes = await query("SELECT * FROM notes WHERE id=?", id);
        res.send(notes[0]);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/deletelogin/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM logins WHERE id=?", id);
        res.send("success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/deletecard/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM cards WHERE id=?", id);
        res.send("success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/deletenote/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM notes WHERE id=?", id);
        res.send("success");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.post("/reprompt", async (req, res) => {
    try {
        const { user, pwd } = req.body;
        if (!user || !pwd) return res.sendStatus(400);
        const users = await query("SELECT * FROM users WHERE id=?", user);
        if (!(users.length > 0)) return res.sendStatus(401); // user does not exist
        const foundUser = { ...users[0] };
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) return res.sendStatus(401); // incorrect password
        res.send("match");
    } catch(err) {
        res.sendStatus(500);
    }
});

app.post("/tfa", async (req, res) => {
    try {
        const { user, auth, type } = req.body;
        if (!user || !auth || !type) return res.sendStatus(400);
        const users = await query("SELECT * FROM users WHERE id=?", user);
        if (!(users.length > 0)) return res.sendStatus(401); // user does not exist
        const foundUser = { ...users[0] };
        const code = parseInt(Math.random() * (999999 - 100000) + 100000).toString();
        await query("UPDATE users SET tfa=?, tfa_code=? WHERE id=?", [type, code, foundUser.id]);

        if (type === 'email') {
            transporter.sendMail({
                from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
                to: auth,
                subject: '[SafeWord] Please verify your device',
                html: `Please input this code in the SafeWord app to verify your login: <b>${code}</b>
                <br>Do not share this code with anyone. If this request did not come from you, change your account password immediately
                to prevent further unauthorized access.`
            });
        } else if (type === 'phone') {
            await query("UPDATE users SET phone=? WHERE id=?", [auth, foundUser.id]);
            itexmo.send({
                to: auth,
                body: `Please input this code in the SafeWord app to verify your login: ${code}`
            });
        }

        res.send("success");
    } catch(err) {
        res.sendStatus(500);
    }
});

app.get("/tfa/:id", async (req, res) => {
    try {
        const users = await query("SELECT * FROM users WHERE id=?", req.params.id);
        if (!(users.length > 0)) return res.sendStatus(401);
        const foundUser = { ...users[0] };
        const type = foundUser.tfa && !foundUser.tfa_code ? foundUser.tfa : '';
        res.send(type);
    } catch(err) {
        res.sendStatus(500);
    }
});

app.post("/tfa/disable", async (req, res) => {
    try {
        const { user, pwd } = req.body;
        if (!user || !pwd) return res.sendStatus(400);
        const users = await query("SELECT * FROM users WHERE id=?", user);
        if (!(users.length > 0)) return res.sendStatus(401); // user does not exist
        const foundUser = { ...users[0] };
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) return res.sendStatus(401); // incorrect password
        await query("UPDATE users SET tfa='' WHERE id=?", user);
        res.send("success");
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.listen(process.env.APP_PORT, () => {
    console.log("Server is running");
});