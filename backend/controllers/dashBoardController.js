const { get } = require("mongoose");
const db = require("../models");

const eventController = require("./eventController");

const kpi = db.kpis;
const heatmap = db.heatmaps;
const graphe = db.graphes;
const company = db.companies;

const getUserDashBoard = async (req, res) => {
    try {
        const { start, end, step, step_type} = req.body;

        console.log('start:', start)
        console.log('end:', end)
        console.log('step:', step)
        console.log('step_type:', step_type)

        const { dataValues } = req.user;
        const userId = dataValues.id;
        const kpis = await getUserKpi(userId);
        const heatmaps = await getUserHeatmap(userId, start, end);
        const graphes = await getUserGraphe(userId, start, end, step, step_type);

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

const getUserKpi = async (userId) => {
    try {
        const kpis = await kpi.findAll({ where: { userId } });

        const res = [];

        for (const kpi of kpis) {
            let data = null;
            if (kpi.conversionId) {
                data = await eventController.getCustomEventsByDate(kpi.conversionId, kpi.start, kpi.end);
            } else {
                data = await eventController.getNbOfEventsByDate(kpi.appId, kpi.event_type, kpi.tag_id, kpi.start, kpi.end);
            }
            res.push({ "kpi": kpi, "data": data });
        }

        return res;
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        return null;
    }
}


const getUserHeatmap = async (userId, tdateStart, tdateEnd) => {
    try {
        const heatmaps = await heatmap.findAll({ where: { userId } });

        let res = [];

        for (const heatmap of heatmaps) {
            let data = await eventController.getHeatMapByDate(heatmap.page_url, tdateStart, tdateEnd);
            heatmap.dataValues.resolution = findCommonResolution(data);

            console.log("heatmap", heatmap);
            res.push({ "heatmap": heatmap, "data": data });
        }

        return res;
    }
    catch (error) {
        console.error('Error fetching dashboard:', error);
        return null;
    }
}

const getUserGraphe = async (userId, tdateStart, tdateEnd, step, step_type) => {
    try {
        const graphes = await graphe.findAll({ where: { userId } });
        const companies = await company.findOne({ where: { userId } });

        const app_id = companies && companies.appId !== null ? companies.appId : 'test';

        let res = [];

        for (const graphe of graphes) {
            let data = await eventController.getGrapheByDateBis(tdateStart, tdateEnd, graphe.event_type, graphe.tag_id, graphe.graphe_type, step, step_type, app_id);

            res.push({ "graphe": graphe, "data": data });
        }

        return res;
    }
    catch (error) {
        console.error('Error fetching dashboard:', error);
        return null;
    }
}

const findCommonResolution = (data) => {
    if (data.length === 0) {
        return null;
    }

    const firstData = data[0];
    const commonResolution = firstData.screen_resolution;

    for (const dataItem of data) {
        if (dataItem.screen_resolution !== commonResolution) {
            return null; // If resolutions are different, return null
        }
    }

    return commonResolution;
}

module.exports = {
    getUserDashBoard
}