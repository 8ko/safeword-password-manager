const express = require("express");
const app = express();
const mysql = require("mysql");
const util = require('util');
const cors = require("cors");
const PORT = 3001;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { encrypt, decrypt } = require("./EncryptionHandler");
const { response } = require("express");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "103198",
    database: "safeword",
});

// node native promisify
const query = util.promisify(db.query).bind(db);

app.get("/showlogins", async (req, res) => {
    try {
        const result = await query("SELECT * FROM logins");
        res.send(result);
    } catch (err) {
        res.status(500).send();
    }
});

app.get("/showcards", async (req, res) => {
    try {
        const result = await query("SELECT * FROM cards");
        res.send(result);
    } catch (err) {
        res.status(500).send();
    }
});

app.get("/shownotes", async (req, res) => {
    try {
        const result = await query("SELECT * FROM notes");
        res.send(result);
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/addlogin", async (req, res) => {
    const { title, username, password, website, note, prompt, iv } = req.body;
    const hashedPassword = encrypt(password);
    try {
        await query("INSERT INTO logins (title, username, password, website, note, prompt, iv, created_at, updated_at) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv]);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/addcard", async (req, res) => {
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("INSERT INTO cards (title, name, number, month, year, cvv, note, prompt, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [title, name, number, month, year, cvv, note, prompt]);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/addnote", async (req, res) => {
    const { title, note, prompt } = req.body;
    try {
        await query("INSERT INTO notes (title, note, prompt, created_at, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [title, note, prompt]);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
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
        res.status(500).send();
    }
});

app.post("/updatecard/:id", async (req, res) => {
    const id = req.params.id;
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    try {
        await query("UPDATE cards SET title=?, name=?, number=?, month=?, year=?, cvv=?, note=?, prompt=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [title, name, number, month, year, cvv, note, prompt, id]);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/updatenote/:id", async (req, res) => {
    const id = req.params.id;
    const { title, note, prompt } = req.body;
    try {
        await query("UPDATE notes SET title=?, note=?, prompt=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [title, note, prompt, id]);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.delete("/deletelogin/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM logins WHERE id=?", id);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.delete("/deletecard/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM cards WHERE id=?", id);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.delete("/deletenote/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await query("DELETE FROM notes WHERE id=?", id);
        res.send("Success");
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/register", async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (email && phone && password) {
            const hashedPwd = await bcrypt.hash(password, saltRounds);
            const result = await query("INSERT INTO users (email, phone, password, created_at, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", [email, phone, hashedPwd]);
            res.send("Success");
        } else {
            // missing input
            res.status(400).send();
        }
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/auth", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            const user = await query("SELECT * FROM users WHERE email=?", email);
            if (user.length > 0) {
                const match = await bcrypt.compare(password, user[0].password);
                if (match) {
                    // implement access token instead
                    res.send(user[0].password);
                } else {
                    // incorrect password
                    res.status(401).send();
                }
            } else {
                // user does not exist
                res.status(401).send();
            }
        } else {
            // missing input
            res.status(400).send();
        }
    } catch (err) {
        res.status(500).send();
    }
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.listen(PORT, () => {
    console.log("Server is running");
});