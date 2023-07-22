module.exports = (sequelize, DataTypes) => {
    const Heatmap = sequelize.define("heatmap", {
        dimensions: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { timestamps: true });

    Heatmap.associate = (models) => {
        // Heatmap has a many-to-one relationship with User
        Heatmap.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
    };

    return Heatmap;
};
