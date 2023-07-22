//importing modules
const express = require("express");
const db = require("../models");
//Assigning db.users to User variable
const User = db.users;
const jwt = require("jsonwebtoken");

const checkAdminRole = (req, res, next) => {
    // Check if the user making the request is authenticated and has the role "admin"
    const { dataValues } = req.user;

    const role  = dataValues.role;

    console.log(role)

    // console.log('TYPEEEEE', req);

    if (role !== "admin") {
        return res.status(403).json({ error: "Unauthorized. Only admin users can perform this action." });
    }

    next();
};

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        const username = await User.findOne({
            where: {
                userName: req.body.userName,
            },
        });
        //if username exist in the database respond with a status of 409
        if (username) {
            return res.json(409).send("username already taken");
        }

        //checking if email already exist
        const emailcheck = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        //if email exist in the database respond with a status of 409
        if (emailcheck) {
            return res.json(409).send("Authentication failed");
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (token === '' || !token.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized. Missing or invalid token.' });
        }
        const authToken = token.slice(7);

        jwt.verify(authToken, process.env.secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
            }
            const user = await User.findByPk(decoded.id);
            req.user = user;

            next();
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred during user authentication.' });
    }
};

//exporting module
module.exports = {
    saveUser,
    authenticate,
    checkAdminRole
};