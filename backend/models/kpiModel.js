module.exports = (sequelize, DataTypes) => {
  const Kpi = sequelize.define(
    "kpi",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Kpi.associate = (models) => {
    // Kpi has a many-to-one relationship with User
    Kpi.belongsTo(models.User, { foreignKey: "userId", allowNull: false });
  };

  return Kpi;
};
