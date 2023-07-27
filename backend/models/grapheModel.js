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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // This should be the table name of the User model
          key: "id", // This should be the primary key of the User model
        },
      },
      event_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tag_id: {
        type: DataTypes.STRING, // Assuming Tag's tag_uid is a UUID
        allowNull: true,
        references: {
          model: "tags", // This should be the table name of the Tag model
          key: "tag_uid", // This should be the primary key of the Tag model (tag_uid)
        }
      },
    },
    { timestamps: true }
  );

  Graph.associate = (models) => {
    // Graph has a many-to-one relationship with User
    Graph.belongsTo(models.User, { foreignKey: "userId", allowNull: false });

    // Kpi has a many-to-one relationship with Tag
    Kpi.belongsTo(models.Tag, { foreignKey: "tag_id", allowNull: true });
  };

  return Graph;
};
