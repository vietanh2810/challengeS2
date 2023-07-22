const db = require("../models");

// Assigning users to the variable User
const Tag = db.tags;

const getAllTags = async (req, res) => {
    try {
        const { dataValues } = req.user;

        if (role === "admin") {
            // If the user is an admin, return all tags
            const tags = await Tag.findAll();
            return res.status(200).json(tags);
        } else {
            // If the user is not an admin, return tags associated with the user's ID
            const userId = dataValues.id;
            const tags = await Tag.findAll({ where: { userId } });
            return res.status(200).json(tags);
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const createTag = async (req, res) => {
    try {
        const { comment } = req.body;

        const tag = await Tag.create({
            comment,
        });

        return res.status(201).json(tag);
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllTags,
    createTag,
}