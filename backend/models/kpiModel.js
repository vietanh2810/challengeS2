module.exports = (sequelize, DataTypes) => {
  const Kpi = sequelize.define(
    "kpi",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id", 
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
      start: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      conversionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "conversionFunnels", // This should be the table name of the ConversionFunnel model
          key: "id", // This should be the primary key of the ConversionFunnel model (id)
        },
      },
    },
    { timestamps: true }
  );

  Kpi.associate = (models) => {
    // Kpi has a many-to-one relationship with User
    Kpi.belongsTo(models.User, { foreignKey: "userId", allowNull: false });

    // Kpi has a many-to-one relationship with Tag
    Kpi.belongsTo(models.Tag, { foreignKey: "tag_id", allowNull: true });

    Kpi.belongsTo(models.ConversionFunnel, { foreignKey: "conversionId", allowNull: true });
  };

  return Kpi;
};
