import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const salt = 10;

const app = express();
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dsa_db"
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.post('/register', (req, res) => {
    console.log('Register body:', req.body);
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error Hassing Password" });
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Inserting data Error in Server" });
            return res.json({ Status: "Success" });
        })
    })
})

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM login WHERE email = ?';
    console.log('Login body:', req.body);
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    return res.json({Status: "Success" });
                } else {
                    return res.json({Error: "Password not matched" });
                }
            })
        } else {
            return res.json({Error: "No email existed" });
        }
    })
})


app.listen(process.env.PORT, () => {
    console.log("running on", process.env.PORT);
})