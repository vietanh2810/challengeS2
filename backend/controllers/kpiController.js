const db = require("../models");

const Kpi = db.kpi;

const getAllKpi = async (req, res) => {
  try {
    const { dataValue } = req.body;

    const userId = dataValue.id;
    const kpi = await Kpi.findAll({ where: { userId } });
    return res.status(200).json(kpi);
  } catch (error) {
    console.error("Error getting kpi:", error);
    return res.status(500).json("Server Error");
  }
};

const createKpi = async (req, res) => {
  try {
    const { name, comment, value } = req.body;
    const kpi = await Kpi.create({
      name,
      comment,
      value,
    });

    return res.status(201).json(kpi);
  } catch (error) {
    console.error("Error creating kpi:", error);
    return res.status(500).json("Server error");
  }
};

module.exports = {
  getAllKpi,
  createKpi,
};
