const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const mailer = require('../mailer/mailer');

// Assigning users to the variable User
const User = db.users;
const Company = db.companies;
const Website = db.websites;

const signup = async (req, res) => {
    try {
        const { userName, email, password, companyName, contactInfo, websiteUrl } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            role: userName === 'admin' ? 'admin' : 'user',
            contactInfo,
        });

        const company = await Company.create({
            companyName,
            kbis: req.file.filename,
            userId: user.id,
        });
        const website = await Website.create({
            baseUrl: websiteUrl,
            userId: user.id,
        });

        const token = jwt.sign({ id: user.id }, process.env.jwtSecret, {
            expiresIn: '1d',
        });
        res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });

        console.log('User:', JSON.stringify(user, null, 2));
        console.log('Company:', JSON.stringify(company, null, 2));
        console.log('Website:', JSON.stringify(website, null, 2));
        console.log('Token:', token);
        //send email

        const html = `
        <h1>Bonjour ${userName}</h1>
        <p>Voici une Confirmation que vous êtes bien inscrit</p>
        `;

        const info = await transporter.sendMail({
            from: 'Trio Challenge <vutony@seznam.cz>',
            to: email,
            subject: 'Message de confirmation',
            html: html
        })
        await mailer.mailer()
        
        console.log("Message sent : " + info.messageId)
        return res.status(201).json(user);
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send('Internal Server Error');
    }
};

//login authentication

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find a user by their email
        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        //if user email is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file

            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.jwtSecret, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

                if (user.isValidated === false) {
                    return res
                        .status(401)
                        .send("Authentication failed, Your account is not validated yet");
                }

                //send user data
                return res.status(201).send({ token, user });
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

const { v4: uuidv4 } = require("uuid");

// Controller function for validating a user
const validateUser = async (req, res) => {
    const { id } = req.params; // Assuming userId is passed as a URL parameter

    try {
        // Find the user in the database based on the provided userId
        const user = await User.findByPk(id);

        const company = await Company.findOne({ where: { userId: id } });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the user making the request has the "admin" role
        const { role } = req.user; // Assuming you have the authenticated user details in the request (set by userAuth middleware)
        if (role !== "admin") {
            return res
                .status(403)
                .json({ error: "Unauthorized. Only admin users can validate users." });
        }

        // Generate a uuid for the user
        const uuid = uuidv4();

        // Update the user's validation status to true
        user.isValidated = true;
        await user.save();

        // Update the linked Company's appId with the generated uuid
        company.appId = uuid;
        await company.save();
        console.log(company);

        res.json({ message: "User validated successfully." });
    } catch (error) {
        console.error("Error during user validation:", error); // Add the error log to the console
        res
            .status(500)
            .json({ error: "An error occurred during user validation." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        //loop every user and check if the user is validated

        for (let i = 0; i < users.length; i++) {
            let tmpId = users[i].id;
            let tmpCompany = await Company.findOne({ where: { userId: tmpId } });

            if (tmpCompany && tmpCompany.kbis !== null) {
                const rawData = users[i].get();

                rawData.kbis = tmpCompany.kbis;

                users[i] = rawData;
            }
        }

        console.log(users)

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
};

const createDefaultAdmin = async () => {
    try {
        // Check if the default admin user already exists
        const admin = await User.findOne({ where: { userName: "admin" } });

        if (!admin) {
            // If the admin user doesn't exist, create it
            const password = "test1234"; // Set your default admin password here
            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                userName: "admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
                isValidated: true, // Assuming default admin is already validated
            });

            console.log("Default admin user created.");
        } else {
            console.log("Default admin user already exists.");
        }
    } catch (error) {
        console.error("Error creating default admin user:", error);
    }
};

const createDefaultWebmaster = async () => {
    try {
        const password = "user1234"; // Set your default webmaster password here
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName: "user",
            email: "user10@example.com",
            password: hashedPassword,
            role: "webmaster",
            isValidated: true, // Got validated
        });

        console.log("Default webmaster user created.");
    } catch (error) {
        console.error("Error creating default webmaster :", error);
    }
};

module.exports = {
    signup,
    login,
    validateUser,
    getAllUsers,
    createDefaultAdmin,
    createDefaultWebmaster,
};
