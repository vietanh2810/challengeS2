const db = require("../models");

// Assigning conversion_funnels to the variable ConvFunnel
const ConversionFunnel = db.conversionFunnel;
const Tag = db.tags;

const getAllConvFunns = async (req, res) => {
    try {
        const { dataValues } = req.user;

        const role = dataValues.role;

        if (role === "admin") {
            // If the user is an admin, return all tags
            const conversion_funnels = await ConversionFunnel.findAll();
            return res.status(200).json(conversion_funnels);
        } else {
            // If the user is not an admin, return tags associated with the user's ID
            const userId = dataValues.id;
            const conversion_funnels = await ConversionFunnel.findAll({ where: { userId } });
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

        const conversion_funnel = await ConversionFunnel.create({
            comment
        });

        let tagsList = new Array();

        for (let index = 0; index < tab_tags.length; index++) {
            const myID = tab_tags[index];
            console.log("uid:" + myID);
            
            const query = { where : {tag_uid: myID} };
            
            var tag= await Tag.findOne(query);
            
            tagsList.push("tag: "+tag);
        }

        tagsList.forEach(tag => {
            console.log(tag);
            conversion_funnel.addTag(tag.tag_uid)
        });
        
        
        //return res.status(201).json(conversion_funnel);
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const updateConvFunn = async (req, res) => {
    try {
        /*const id = req.params.id;
        const { comment } = req.body;

        const tag = await Tag.update({comment : comment}, {
            where: { tag_uid : id },
            returning: true,
        });

        if (!tag ) {
            return res.sendStatus(404);
        } else return res.status(200).json(tag);*/
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