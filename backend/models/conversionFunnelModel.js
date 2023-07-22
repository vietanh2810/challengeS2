module.exports = (sequelize, DataTypes) => {
    const ConversionFunnel = sequelize.define("conversionFunnel", {
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { timestamps: true });

    ConversionFunnel.associate = (models) => {
        // ConversionFunnel has a many-to-many relationship with Tag through a join table (ConversionFunnelTag)
        ConversionFunnel.belongsToMany(models.Tag, { through: 'ConversionFunnelTag', foreignKey: 'funnelId' });
    };

    return ConversionFunnel;
};
