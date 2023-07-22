module.exports = (sequelize, DataTypes) => {
    const Graph = sequelize.define("graph", {
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
        }
    }, { timestamps: true });

    Graph.associate = (models) => {
        // Graph has a many-to-one relationship with User
        Graph.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
    };

    return Graph;
};
