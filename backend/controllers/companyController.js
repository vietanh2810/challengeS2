const db = require("../models");

const Company = db.companies;

const getCompany = async (req, res) => {
    try {
        const { dataValues } = req.user;

        const role = dataValues.role;

        if (role === "admin") {
            // If the user is an admin, return all companies
            const companies = await Company.findAll();
            return res.status(200).json(companies);
        } else {
            // If the user is not an admin, return companies associated with the user's ID
            const userId = dataValues.id;
            const companies = await Company.findAll({ where: { userId } });
            return res.status(200).json(companies);
        }
    } catch (error) {
        console.error('Error fetching companies:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getCompany
}