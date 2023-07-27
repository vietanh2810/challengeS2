module.exports = (sequelize, DataTypes) => {
  const Heatmap = sequelize.define(
    "heatmap",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // This should be the table name of the User model
          key: "id", // This should be the primary key of the User model
        },
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
