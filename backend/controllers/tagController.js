const db = require("../models");
const crypto = require('crypto')
const { v4: uuidv4 } = require("uuid");

// Assigning tags to the variable Tag
const Tag = db.tags;
const User = db.users;
const getAllTags = async (req, res) => {
    try {
        const { dataValues } = req.user;

        const role = dataValues.role;

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
        const { dataValues } = req.user;
        const userId = dataValues.id;

        const tag = await Tag.create({
            comment: comment,
            userId: userId,
            tag_uid: generateUniqueTag()
        });

        return res.status(201).json(tag);
    } catch (error) {
        console.error('Error during creating tag:', error);
        return res.status(500)//.send('Internal Server Error');
    }
};

const createDefaultTag = async (tagUid,userID) => {
    try {
        console.log(userID)

        const tag = await Tag.create({
            comment: "Default tag",
            userId: userID,
            tag_uid: tagUid
        });

        return tag;
    } catch (error) {
        console.error('Error during signup:', error);
        return null;
    }
};

const updateTag = async (req, res) => {
    try {
        const id = req.params.id;
        const { comment } = req.body;

        const tag = await Tag.update({comment : comment}, {
            where: { tag_uid : id },
            returning: true,
        });

        if (!tag ) {
            return res.sendStatus(404);
        } else return res.status(200).json(tag);
    } catch (error) {
        console.error('Error during edit:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const generateUniqueTag = () => {
    // Generate a UUID
    const uuid = uuidv4();

    // Create a hash
    const hash = crypto.createHash('sha256').update(uuid).digest('hex');

    // Trim to 10 characters
    const trimmedHash = hash.substr(0, 10);

    // Append "-tag"
    const uniqueTag = trimmedHash + '-tag';

    return uniqueTag;
}

module.exports = {
    getAllTags,
    createTag,
    updateTag,
    createDefaultTag
}