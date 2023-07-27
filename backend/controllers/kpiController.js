const db = require("../models");

const Kpi = db.kpis;

const createKpi = async (req, res) => {
  try {
    // Get the KPI data from the request body
    const { name, value, value_type, description, event_type, start, end, conversionId } = req.body;
    const { dataValues } = req.user;
    const userId = dataValues.id;

    // Save the user data to the database
    const newKpi = await Kpi.create({
      name: name,
      value: value,
      value_type: value_type,
      description: description,
      event_type: event_type,
      start: start,
      end: end,
      conversionId: conversionId,
      userId: userId,
    });

    // Respond with the saved KPI
    return res.status(201).json(newKpi);
  } catch (error) {
    // Handle errors
    console.log("Error creating KPI:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get all KPIs
const getAllKpis = async (req, res) => {
  try {
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Fetch all KPIs from the database
      const AllKpis = await Kpi.findAll();
      return res.status(200).json(AllKpis);
    } else {
      const userId = dataValues.id;
      const AllKpis = await Kpi.findAll({ where: { id: id, userid: userId } });
      return res.status(200).json(AllKpis);
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching KPIs:", error);
    return res.status(500).json({ error: "Can't get all Kpis" });
  }
};

// Function to get a single KPI by ID
const getKpiById = async (req, res) => {
  try {
    // Get the KPI ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const { role } = dataValues;

    if (role === "admin") {
      // Fetch the KPI from the database by its ID
      const kpi = await Kpi.findByPk(id);
      if (!kpi) {
        // Check if the KPI exists
        return res.status(404).json({ error: "KPI not found" });
      }
      return res.status(200).json(kpi);
    } else {
      const userId = dataValues.id;
      const kpi = await Kpi.findByPk(id, { where: { userId } });
      if (!kpi) {
        // Check if the KPI exists
        return res.status(404).json({ error: "KPI not found" });
      }
      return res.status(200).json(kpi);
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching KPIs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a KPI by ID
const updateKpiById = async (req, res) => {
  try {
    // Get the KPI ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Get the updated data for the KPI from the request body
      const { name, value, description, event_type } = req.body;

      // Find the KPI in the database by its ID and update it
      const updatedKPI = await Kpi.update(
        { name, value, description, event_type },
        { where: { id: id } }
      );
      // Check if the KPI exists
      if (!updatedKPI) {
        return res.status(404).json({ error: "KPI not found" });
      }
      // Respond with the updated KPI
      return res.status(200).json(updatedKPI);
    } else {
      const { name, value, description, event_type } = req.body;
      const { dataValues } = req.user;
      const userId = dataValues.id;
      const updatedKPI = await Kpi.update(
        { value, description, name, event_type },
        { where: { id: id, userId: userId } }
      );
      // Check if the KPI exists
      if (!updatedKPI) {
        return res.status(404).json({ error: "KPI not found" });
      }
      // Respond with the updated KPI
      return res.status(200).json(updatedKPI);
    }
  } catch (error) {
    // Handle errors
    console.log(dataValues);
    console.error("Error updating KPIs:", error);
    return res.status(500).json({ error: "Updating Error" });
  }
};

// Function to delete a KPI by ID
const deleteKpiById = async (req, res) => {
  try {
    // Get the KPI ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Find the KPI in the database by its ID and delete it
      const deletedKPI = await Kpi.destroy({ where: { id } });

      // Check if the KPI exists
      if (!deletedKPI) {
        return res.status(404).json({ error: "KPI not found" });
      }
      // Respond with the deleted KPI
      return res.status(200).json(deletedKPI);
    } else {
      const userId = dataValues.id;
      const deletedKPI = await Kpi.destroy({ where: { userId } });
      // Check if the KPI exists
      if (!deletedKPI) {
        return res.status(404).json({ error: "KPI not found" });
      }
      // Respond with the deleted KPI
      return res.status(200).json(deletedKPI);
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating KPIs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createKpi,
  getAllKpis,
  getKpiById,
  updateKpiById,
  deleteKpiById,
};
