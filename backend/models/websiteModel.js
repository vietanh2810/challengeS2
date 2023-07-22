module.exports = (sequelize, DataTypes) => {
    const Website = sequelize.define("website", {
        baseUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { timestamps: true });

    Website.associate = (models) => {
        // Website has a many-to-one relationship with User
        Website.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
    };

    return Website;
};
