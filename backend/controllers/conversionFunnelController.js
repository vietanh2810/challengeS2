const db = require("../models");

// Assigning conversion_funnels to the variable ConvFunnel
const ConversionFunnel = db.conversionFunnel;
const Tag = db.tags;
const ConversionFunnelTag = db.conversionFunnelTag;

const getAllConvFunns = async (req, res) => {
    try {
        const { dataValues } = req.user;

        const role = dataValues.role;

        if (role === "admin") {
            // If the user is an admin, return all tags
            const conversion_funnels = await ConversionFunnel.findAll({
                include: [
                    {
                      model: Tag,
                      as: "tags",
                      attributes: ["tag_uid", "comment"],
                      through: {
                        attributes: [],
                      }
                    },
                ],
            });
            return res.status(200).json(conversion_funnels);
        } else {
            // If the user is not an admin, return tags associated with the user's ID
            const userId = dataValues.id;
            const conversion_funnels = await ConversionFunnel.findAll({ where: { userId }, include: [
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["tag_uid", "comment"],
                    through: {
                        attributes: [],
                    }
                }
            ], }, 
            );
            return res.status(200).json(conversion_funnels);
        }
    } catch (error) {
        console.error('Error fetching conversion_tunnels:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const createConvFunn = async (req, res) => {
    try {
        const tab_tags = req.body.tags;
        const comment = req.body.comment;
        const { dataValues } = req.user;

        const conversion_funnel = await ConversionFunnel.create({
            comment,
            userId: dataValues.id
        });

        let tagsList = new Array();

        /*for (let index = 0; index < tab_tags.length; index++) {
            const myID = tab_tags[index];
            const tag = await Tag.findOne({ 
                where : {tag_uid: myID} 
            });
            await ConversionFunnelTag.create({funnelId: conversion_funnel.id, tagId: tag.tag_uid, userId: dataValues.id});
        }

        const table_tags = await ConversionFunnelTag.findAll({where: {funnelId: conversion_funnel.id}, order: [['createdAt', 'ASC']]})*/

        for (let index = 0; index < tab_tags.length; index++) {
            const myID = tab_tags[index];
            conversion_funnel.addTag(myID);
        }
        
        return res.status(201).json(conversion_funnel);
    } catch (error) {
        console.error('Error during creation:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const updateConvFunn = async (req, res) => {
    try {
        const id = req.params.id;
        const { comment } = req.body;

        const conversion_funnel = await ConversionFunnel.update({comment : comment}, {
            where: { id : id },
            returning: true,
        });

        if (!conversion_funnel ) {
            return res.sendStatus(404);
        } else return res.status(200).json(conversion_funnel);
    } catch (error) {
        console.error('Error during edit:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAllConvFunns,
    createConvFunn,
    updateConvFunn
}