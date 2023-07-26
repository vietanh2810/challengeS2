const db = require("../models");

// Assigning users to the variable User
const kpi = db.kpis;
const heatmap = db.heatmaps;
const graphe = db.graphes;

const getUserDashBoard = async (req, res) => {
    try {
        const { tdateStart, tdateEnd, step } = req.body;

        const { dataValues } = req.user;
        const userId = dataValues.id;
        const kpis = await kpi.findAll({ where: { userId } });
        const heatmaps = await heatmap.findAll({ where: { userId } });
        const graphes = await graphe.findAll({ where: { userId } });
        const company = await Company.findOne({ where: { userId } });
        const appId = company.appId;
        return res.status(200).json({
            kpis: kpis,
            heatmaps: heatmaps,
            graphes: graphes
        });
        
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getUserDashBoard
}