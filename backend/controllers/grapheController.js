const db = require("../models");

const Graphe = db.graphes;

const createGraphe = async (req, res) => {
  try {
    // Get the Graphe data from the request body
    const { name, event_type, graphe_type, tag_id } = req.body;
    const { dataValues } = req.user;
    const userId = dataValues.id;
    // Save the user data to the database
    const newGraphe = await Graphe.create({
      graphe_type: graphe_type,
      name: name,
      userId: userId,
      event_type: event_type,
      tag_id: tag_id,
    });

    // Respond with the saved Graphe
    return res.status(201).json(newGraphe);
  } catch (error) {
    // Handle errors
    console.error("Error creating Graphe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get all Graphes
const getAllGraphes = async (req, res) => {
  try {
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Fetch all Graphes from the database
      const AllGraphes = await Graphe.findAll();

      // Respond with the fetched Graphes
      return res.status(200).json(AllGraphes);
    } else {
      const userId = dataValues.id;
      const AllGraphes = await Graphe.findAll({ where: { userId } });
      return res.status(200).json(AllGraphes);
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching Graphes:", error);
    return res.status(500).json({ error: "Can't get all Graphes" });
  }
};

// Function to get a single Graphe by ID
const getGrapheById = async (req, res) => {
  try {
    // Get the Graphe ID from the request parameters
    const { id } = req.params;

    // Fetch the Graphe from the database by its ID
    const graphe = await Graphe.findByPk(id);

    // Check if the Graphe exists
    if (!graphe) {
      return res.status(404).json({ error: "Graphe not found" });
    }

    // Respond with the fetched Graphe
    return res.status(200).json(graphe);
  } catch (error) {
    // Handle errors
    console.error("Error fetching Graphes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a Graphe by ID
const updateGrapheById = async (req, res) => {
  try {
    // Get the Graphe ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Get the updated data for the Graphe from the request body
      const { graphe_type, name, event_type } = req.body;

      // Find the Graphe in the database by its ID and update it
      const updatedGraphe = await Graphe.update(
        { graphe_type, name, user_id, event_type },
        { where: { id: id } }
      );

      // Check if the Graphe exists
      if (!updatedGraphe) {
        return res.status(404).json({ error: "Graphe not found" });
      }

      // Respond with the updated Graphe
      return res.status(200).json(updatedGraphe);
    } else {
      const { graphe_type, name, event_type } = req.body;
      const { dataValues } = req.user;
      const userId = dataValues.id;
      const updatedGraphe = await Graphe.update(
        { graphe_type, name, event_type },
        { where: { id: id, userId: userId } }
      );
      // Check if the Graphe exists
      if (!updatedGraphe) {
        return res.status(404).json({ error: "Graphe not found" });
      }
      // Respond with the updated Graphe
      return res.status(200).json(updatedGraphe);
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Graphes:", error);
    return res.status(500).json({ error: "Updating Error" });
  }
};

// Function to delete a Graphe by ID
const deleteGrapheById = async (req, res) => {
  try {
    // Get the Graphe ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Find the Graphe in the database by its ID and delete it
      const deletedGraphe = await Graphe.destroy({ where: { id } });

      // Check if the Graphe exists
      if (!deletedGraphe) {
        return res.status(404).json({ error: "Graphe not found" });
      }

      // Respond with the deleted Graphe
      return res.status(200).json(deletedGraphe);
    } else {
      const userId = dataValues.id;
      const deletedGraphe = await Graphe.destroy({ where: { userId } });
      // Check if the Graphe exists
      if (!deletedGraphe) {
        return res.status(404).json({ error: "Graphe not found" });
      }
      // Respond with the deleted Graphe
      return res.status(200).json(deletedGraphe);
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Graphes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createGraphe,
  getAllGraphes,
  getGrapheById,
  updateGrapheById,
  deleteGrapheById,
};
