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

app.post("/addpassword", (req, res) => {
    const { type, title, password, username, website, note } = req.body;
    console.log(req.body);
    const hashedPassword = encrypt(password);
    db.query(
        "INSERT INTO passwords (type, title, password, iv, username, website, note) VALUES (?,?,?,?,?,?,?)", [type, title, hashedPassword.password, hashedPassword.iv, username, website, note],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
});

app.get("/showpasswords", (req, res) => {
    db.query("SELECT * FROM passwords;", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/deletepassword/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM safeword.passwords WHERE passwords.id=?", id, (err, result) => {
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