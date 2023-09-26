module.exports = (sequelize, DataTypes) => {
    const Alert = sequelize.define("Alert", {
        event_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tag_id: {
            type: DataTypes.STRING, // Assuming Tag's tag_uid is a UUID
            allowNull: true,
            references: {
              model: "tags", // This should be the table name of the Tag model
              key: "tag_uid", // This should be the primary key of the Tag model (tag_uid)
            }
        },
        conversionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: "conversionFunnels", // This should be the table name of the ConversionFunnel model
              key: "id", // This should be the primary key of the ConversionFunnel model (id)
            },
        },
        time_scale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        value_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notif_method: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_alert_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mail: {
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
    }, { timestamps: true });
    Alert.associate = (models) => {
        Alert.belongsTo(models.User, { foreignKey: "userId", allowNull: false });

        Kpi.belongsTo(models.Tag, { foreignKey: "tag_id", allowNull: true });

        Kpi.belongsTo(models.ConversionFunnel, { foreignKey: "conversionId", allowNull: true });
    };
    return Alert;
};
