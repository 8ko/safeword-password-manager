const express = require("express");
const app = express();
const mysql = require("mysql");
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

app.post("/addlogin", (req, res) => {
    const { title, username, password, website, note, prompt, iv } = req.body;
    const hashedPassword = encrypt(password);
    db.query(
        "INSERT INTO logins (title, username, password, website, note, prompt, iv) VALUES (?,?,?,?,?,?,?)", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv],
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
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    console.log(req.body);
    db.query(
        "INSERT INTO cards (title, name, number, month, year, cvv, note, prompt) VALUES (?,?,?,?,?,?,?,?)", [title, name, number, month, year, cvv, note, prompt],
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

app.post("/updatelogin/:id", (req, res) => {
    const id = req.params.id;
    const { title, username, password, website, note, prompt } = req.body;
    const hashedPassword = encrypt(password);
    db.query(
        "UPDATE logins SET title=?, username=?, password=?, website=?, note=?, prompt=?, iv=? WHERE id=?", [title, username, hashedPassword.password, website, note, prompt, hashedPassword.iv, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
});

app.post("/updatecard/:id", (req, res) => {
    const id = req.params.id;
    const { title, name, number, month, year, cvv, note, prompt } = req.body;
    db.query(
        "UPDATE cards SET title=?, name=?, number=?, month=?, year=?, cvv=?, note=?, prompt=? WHERE id=?", [title, name, number, month, year, cvv, note, prompt, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
});

app.post("/updatenote/:id", (req, res) => {
    const id = req.params.id;
    const { title, note, prompt } = req.body;
    db.query(
        "UPDATE notes SET title=?, note=?, prompt=? WHERE id=?", [title, note, prompt, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        }
    );
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

app.delete("/deletecard/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM cards WHERE id=?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/deletenote/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM notes WHERE id=?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    // return res.send();

    if (email && password) {
        db.query("SELECT * FROM users WHERE email=?", email, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                return res.send(result[0].password);
                bcrypt.compare(password, result[0].password, function(err, match) {
                    if (match) {
                        res.send(result[0]);
                    } else {
                        console.log('401');
                        res.status(401).send();
                    }
                });
            } else {
                console.log('401');
                res.status(401).send();
            }
            res.end();
        });
    } else {
        res.status(400).send();
        res.end();
    }
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.listen(PORT, () => {
    console.log("Server is running");
});