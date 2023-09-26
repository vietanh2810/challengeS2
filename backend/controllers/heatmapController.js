const db = require("../models");

const Heatmap = db.heatmaps;

const createHeatmap = async (req, res) => {
  try {
    // Get the Heatmap data from the request body
    const { name, page_url } = req.body;
    const { dataValues } = req.user;
    const userId = dataValues.id;

    // Save the user data to the database
    const newHeatmap = await Heatmap.create({
      name: name,
      userId: userId,
      page_url: page_url,
    });

    // Respond with the saved Heatmap
    return res.status(201).json(newHeatmap);
  } catch (error) {
    // Handle errors
    console.error("Error updating Heatmaps:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createDefaultHeatmap = async (userId, name, page_url) => {
  try {
    await Heatmap.create({
      name: name,
      userId: userId,
      page_url: page_url,
    });
    console.log("Default Heatmap created.");
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
};

// Function to get all Heatmaps
const getAllHeatmaps = async (req, res) => {
  try {
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Fetch all Heatmaps from the database
      const AllHeatmaps = await Heatmap.findAll();

      // Respond with the fetched Heatmaps
      return res.status(200).json(AllHeatmaps);
    } else {
      const userId = dataValues.id;
      const AllHeatmaps = await Heatmap.findAll({ where: { userId } });
      return res.status(200).json(AllHeatmaps);
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching Heatmaps:", error);
    return res.status(500).json({ error: "Can't get all Heatmaps" });
  }
};

// Function to get a single Heatmap by ID
const getHeatmapById = async (req, res) => {
  try {
    // Get the Heatmap ID from the request parameters
    const { id } = req.params;

    // Fetch the Heatmap from the database by its ID
    const heatmap = await Heatmap.findByPk(id);

    // Check if the Heatmap exists
    if (!heatmap) {
      return res.status(404).json({ error: "Heatmap not found" });
    }

    // Respond with the fetched Heatmap
    return res.status(200).json(heatmap);
  } catch (error) {
    // Handle errors
    console.error("Error fetching Heatmaps:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a Heatmap by ID
const updateHeatmapById = async (req, res) => {
  try {
    // Get the Heatmap ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Get the updated data for the Heatmap from the request body
      const { name, page_url } = req.body;

      // Find the Heatmap in the database by its ID and update it
      const updatedHeatmap = await Heatmap.update(
        { name, page_url },
        { where: { id: id } }
      );
      // Check if the Heatmap exists
      if (!updatedHeatmap) {
        return res.status(404).json({ error: "Heatmap not found" });
      }

      return res.status(200).json(updatedHeatmap);
    } else {
      const { name, page_url } = req.body;
      const { dataValues } = req.user;
      const userId = dataValues.id;
      const updatedHeatmap = await Heatmap.update(
        { name, page_url },
        { where: { id: id, userId: userId } }
      );
      // Check if the Heatmap exists
      if (!updatedHeatmap) {
        return res.status(404).json({ error: "Heatmap not found" });
      }
      // Respond with the updated Heatmap
      return res.status(200).json(updatedHeatmap);
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Heatmaps:", error);
    return res.status(500).json({ error: "Updating Error" });
  }
};

// Function to delete a Heatmap by ID
const deleteHeatmapById = async (req, res) => {
  try {
    // Get the Heatmap ID from the request parameters
    const { id } = req.params;
    const { dataValues } = req.user;
    const role = dataValues.role;

    if (role === "admin") {
      // Find the Heatmap in the database by its ID and delete it
      const deletedHeatmap = await Heatmap.destroy({ where: { id } });

      // Check if the Heatmap exists
      if (!deletedHeatmap) {
        return res.status(404).json({ error: "Heatmap not found" });
      }

      // Respond with the deleted Heatmap
      return res.status(200).json(deletedHeatmap);
    } else {
      const userId = dataValues.id;
      const deletedHeatmap = await Heatmap.destroy({
        where: { id: id, userid: userId },
      });
      // Check if the Heatmap exists
      if (!deletedHeatmap) {
        return res.status(404).json({ error: "Heatmap not found" });
      }
      // Respond with the deleted Heatmap
      return res.status(200).json(deletedHeatmap);
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Heatmaps:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createHeatmap,
  getAllHeatmaps,
  getHeatmapById,
  updateHeatmapById,
  deleteHeatmapById,
  createDefaultHeatmap,
};
