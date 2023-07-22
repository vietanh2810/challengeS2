module.exports = (sequelize, DataTypes) => {
    const Kpi = sequelize.define("kpi", {
        dimensions: {
            type: DataTypes.STRING,
            allowNull: true
        },
        timeScale: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dataType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visualizationType: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { timestamps: true });

    Kpi.associate = (models) => {
        // Kpi has a many-to-one relationship with User
        Kpi.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
    };

    return Kpi;
};
