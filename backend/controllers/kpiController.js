const db = require("../models");

const Kpi = db.kpis;

const createKpi = async (req, res) => {
  try {
    // Get the KPI data from the request body
    const { name, value, description } = req.body;

    // Save the user data to the database
    const newKpi = await Kpi.create({
      name,
      value,
      description,
    });

    // Respond with the saved KPI
    return res.status(201).json(newKpi);
  } catch (error) {
    // Handle errors

    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get all KPIs
const getAllKpis = async (req, res) => {
  try {
    // Fetch all KPIs from the database
    const AllKpis = await Kpi.findAll();

    // Respond with the fetched KPIs
    return res.status(200).json(AllKpis);
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

    // Fetch the KPI from the database by its ID
    const kpi = await Kpi.findByPk(id);

    // Check if the KPI exists
    if (!kpi) {
      return res.status(404).json({ error: "KPI not found" });
    }

    // Respond with the fetched KPI
    return res.status(200).json(kpi);
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

    // Get the updated data for the KPI from the request body
    const { name, value, description } = req.body;

    // Find the KPI in the database by its ID and update it
    const updatedKPI = await Kpi.update(
      { name, value, description },
      { where: { id: id } }
    );

    // Check if the KPI exists
    if (!updatedKPI) {
      return res.status(404).json({ error: "KPI not found" });
    }

    // Respond with the updated KPI
    return res.status(200).json(updatedKPI);
  } catch (error) {
    // Handle errors
    console.error("Error updating KPIs:", error);
    return res.status(500).json({ error: "Updating Error" });
  }
};

// Function to delete a KPI by ID
const deleteKpiById = async (req, res) => {
  try {
    // Get the KPI ID from the request parameters
    const { id } = req.params;

    // Find the KPI in the database by its ID and delete it
    const deletedKPI = await Kpi.destroy({ where: { id } });

    // Check if the KPI exists
    if (!deletedKPI) {
      return res.status(404).json({ error: "KPI not found" });
    }

    // Respond with the deleted KPI
    return res.status(200).json(deletedKPI);
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
