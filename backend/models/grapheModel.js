module.exports = (sequelize, DataTypes) => {
  const Graph = sequelize.define(
    "graph",
    {
      graphe_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Graph.associate = (models) => {
    // Graph has a many-to-one relationship with User
    Graph.belongsTo(models.User, { foreignKey: "userId", allowNull: false });
  };

  return Graph;
};
