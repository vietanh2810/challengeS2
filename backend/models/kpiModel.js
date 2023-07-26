module.exports = (sequelize, DataTypes) => {
  const Kpi = sequelize.define(
    "kpi",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      value: {
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
      event_type: {
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
