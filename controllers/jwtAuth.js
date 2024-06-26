const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModal = require('../models/usermodel');

const router = express.Router();

// JWT Secret Key (keep this secure and ideally in environment variables)
const JWT_SECRET_KEY = "supersecret";

console.log('Generated JWT Token:', JWT_SECRET_KEY);

// Middleware to generate JWT token
function generateToken(user) {
    return jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const header = req.headers['authorization'];

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
}

// Route to authenticate user and generate JWT


module.exports = { verifyToken, generateToken}