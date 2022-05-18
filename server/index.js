const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3001;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "103198",
    database: "safeword",
});

app.post("/addlogin", (req, res) => {
    const { title, username, password, website, note, prompt } = req.body;
    const hashedPassword = encrypt(password);
    db.query(
        "INSERT INTO logins (title, username, password, website, note, prompt, iv) VALUES (?,?,?,?,?,?)", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
});

app.post("/addcard", (req, res) => {
    const { brand, name, number, month, year, cvv, note, prompt } = req.body;
    console.log(req.body);
    db.query(
        "INSERT INTO cards (brand, name, number, month, year, cvv, note, prompt) VALUES (?,?,?,?,?,?,?,?)", [brand, name, number, month, year, cvv, note, prompt],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
});

app.post("/addnote", (req, res) => {
    const { title, note, prompt } = req.body;
    db.query(
        "INSERT INTO notes (title, note, prompt) VALUES (?,?,?)", [title, note, prompt],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
});

app.get("/showlogins", (req, res) => {
    db.query("SELECT * FROM logins;", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/showcards", (req, res) => {
    db.query("SELECT * FROM cards;", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/shownotes", (req, res) => {
    db.query("SELECT * FROM notes;", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/deletelogin/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM logins WHERE id=?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.listen(PORT, () => {
    console.log("Server is running");
});