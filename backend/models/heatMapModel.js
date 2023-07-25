module.exports = (sequelize, DataTypes) => {
  const Heatmap = sequelize.define(
    "heatmap",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      page_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Heatmap.associate = (models) => {
    // Heatmap has a many-to-one relationship with User
    Heatmap.belongsTo(models.User, { foreignKey: "userId", allowNull: false });
  };

  return Heatmap;
};
