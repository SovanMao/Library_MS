const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRETE = process.env.JWT_SECRETE;
const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://student_lb:80';
const LIBRARIAN_SERVICE_URL = process.env.LIBRARIAN_SERVICE_URL || 'http://librarian_service:5001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth_service:4000';

function authToken(req, res, next) {
    console.log(req.headers.authorization)
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json("Please send token");

    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) return res.status(403).json("Invalid token", err);
        req.user = user;
        next()
    })
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json("Unauthorized");
        }
        next();
    }
}

// 1. REDIRECT TO THE STUDENT LOAD BALANCER (Nginx) ON PORT 80
app.use('/student', authToken, authRole('student'), (req, res) => {
    console.log("INSIDE API GATEWAY STUDENT ROUTE")
    proxy.web(req, res, { target: STUDENT_SERVICE_URL });
})

// 2. REDIRECT TO THE LIBRARIAN MICROSERVICE CONTAINER ON PORT 5001
app.use('/librarian', authToken, authRole('librarian'), (req, res) => {
    console.log("INSIDE API GATEWAY LIBRARIAN ROUTE")
    proxy.web(req, res, { target: LIBRARIAN_SERVICE_URL });
})

// 3. REDIRECT TO THE AUTHENTICATION MICROSERVICE CONTAINER ON PORT 4000
app.use('/auth', (req, res) => {
    proxy.web(req, res, { target: AUTH_SERVICE_URL });
})

app.use('/reg', (req, res) => {
    proxy.web(req, res, { target: AUTH_SERVICE_URL });
})

app.listen(3000, () => {
    console.log("API Gateway Service is running on PORT NO : 3000")
})