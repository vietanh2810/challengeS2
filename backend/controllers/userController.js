const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const mailer = require("../mailer/mailer");
const nodeMailer = require("nodemailer");

// Assigning users to the variable User
const User = db.users;
const Company = db.companies;
const Website = db.websites;
const tagController = require("./tagController");

const signup = async (req, res) => {

    try {
        const { userName, email, password, companyName, contactInfo, websiteUrl } =
            req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            role: userName === "admin" ? "admin" : "user",
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
            expiresIn: "1d",
        });
        res.cookie("jwt", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        /*console.log("User:", JSON.stringify(user, null, 2));
        console.log("Company:", JSON.stringify(company, null, 2));
        console.log("Website:", JSON.stringify(website, null, 2));
        console.log("Token:", token);*/
        //emailing
        const toEmail = user.email;
        const content = `
        <h1>Bonjour ${userName}</h1>
        <p>Voici une Confirmation que vous êtes bien inscrit !</p>
        `;

        const transporter = nodeMailer.createTransport({
            host: "smtp.seznam.cz",
            port: 465,
            secure: true,
            auth: {
                user: "vutony@seznam.cz",
                pass: "Test1234test",
            },
        });

        const message = {
            from: "Trio Challange <vutony@seznam.cz>",
            to: toEmail,
            subject: "Confirmation Message",
            html: content,
        };

        // Call the mailer function
        try {
            await mailer.mailer(toEmail, content);
            console.log("Message sent");
            console.log(message);
            console.log(content);
        } catch (error) {
            console.error("Error sending confirmation email:", error);
        }
        console.log("User created");
        return res.status(201).json(user);
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send("Internal Server Error");
    }
};

//login authentication

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find a user by their email
        let user = await User.findOne({
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

                const tmpCompany = await Company.findOne({ where: { userId: user.id } });

                if (tmpCompany && tmpCompany.kbis !== null) {
                    const rawData = user.get();

                    rawData.appId = tmpCompany.appId;

                    user = rawData;
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

const validateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        const company = await Company.findOne({ where: { userId: id } });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const { role } = req.user;
        if (role !== "admin") {
            return res
                .status(403)
                .json({ error: "Unauthorized. Only admin users can validate users." });
        }

        const uuid = uuidv4();

        user.isValidated = true;
        await user.save();

        company.appId = uuid;
        await company.save();
        //console.log(company);

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

        //console.log(users);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createDefaultAdmin = async () => {
    try {
        const admin = await User.findOne({ where: { userName: "admin" } });

        if (!admin) {
            const password = "test1234"; 
            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                userName: "admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
                isValidated: true, 
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
        const password = "user1234";
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName: "user",
            email: "user10@example.com",
            password: hashedPassword,
            role: "webmaster",
            isValidated: true, // Got validated
        });
        const user = await User.findOne({ where: { userName: "user" } });
        await Company.create({
            appId: 'test',
            companyName: 'Trio Challenge - sdk test site',
            kbis: null,
            userId: user.id,
        });
        const website = await Website.create({
            baseUrl: 'http://localhost:8081/',
            userId: user.id,
        });


        return user.dataValues;
    } catch (error) {
        console.error("Error creating default webmaster :", error);
        return null;
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
