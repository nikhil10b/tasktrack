import express from "express";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const salt = 10;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",  // Ensure this is the frontend URL
    methods: ["POST", "GET"], 
    credentials: true  // Allow cookies to be sent
}));
app.use(cookieParser());

// Database connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Nikhil12#",  
    database: "p_db",  // Your MySQL database name
});

// Middleware to verify the user based on JWT token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    }
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.json({ Error: "Token is not okay" });
        } else {
            req.name = decoded.name;
            next();
        }
    });
};

// Route to check authentication status
app.get('/taskmanagement', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
});

// Register route
app.post('/register', (req, res) => {
    const sql = "INSERT INTO loginpage (`name`, `email`, `password`) VALUES (?)";

    // Hash the password using bcrypt
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [
            req.body.name,
            req.body.email,
            hash,
        ];

        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Error inserting data" });
            return res.json({ Status: "Success" });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM loginpage WHERE email = ?';

    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });

        if (data.length > 0) {
            // Compare the hashed password with the one in the database
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password verification error" });

                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token, { httpOnly: true });  // Set the token in cookie

                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Incorrect password" });
                }
            });
        } else {
            return res.json({ Error: "No email exists" });
        }
    });
});




// Task CRUD API Routes
app.get('/tasks', verifyUser, (req, res) => {
    const sql = "SELECT * FROM tasks WHERE user_name = ?";
    db.query(sql, [req.name], (err, result) => {
        if (err) return res.json({ Error: "Fetching tasks failed" });
        return res.json(result);
    });
});

app.post('/tasks', verifyUser, (req, res) => {
    const sql = "INSERT INTO tasks (user_name, title, description, status) VALUES (?)";
    const values = [
        req.name, req.body.title, req.body.description, "Pending"
    ];

    db.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Task creation failed" });
        return res.json({ Status: "Success", TaskID: result.insertId });
    });
});

app.put('/tasks/:id', verifyUser, (req, res) => {
    const sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_name = ?";
    db.query(sql, [req.body.title, req.body.description, req.body.status, req.params.id, req.name], 
        (err, result) => {
            if (err) return res.json({ Error: "Task update failed" });
            return res.json({ Status: "Success" });
        }
    );
});

app.delete('/tasks/:id', verifyUser, (req, res) => {
    const sql = "DELETE FROM tasks WHERE id = ? AND user_name = ?";
    db.query(sql, [req.params.id, req.name], (err, result) => {
        if (err) return res.json({ Error: "Task deletion failed" });
        return res.json({ Status: "Success" });
    });
});


// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});
