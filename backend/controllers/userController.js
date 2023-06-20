//importing modules
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

// Assigning users to the variable User
const User = db.users;

//signing a user up
//hashing users password before its saved to the database with bcrypt

const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
        });

        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.secretKey, {
                expiresIn: '1d',
            });

            res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });

            console.log('User:', JSON.stringify(user, null, 2));
            console.log('Token:', token);

            return res.status(201).json(user);
        } else {
            return res.status(409).send('Details are not correct');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = signup;



//login authentication

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find a user by their email
        const user = await User.findOne({
            where: {
                email: email
            }

        });

        //if user email is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file

            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                //send user data
                return res.status(201).send(user);
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signup,
    login,
};