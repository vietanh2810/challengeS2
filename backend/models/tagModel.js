module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define("tag", {
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { timestamps: true });

    Tag.associate = (models) => {
        // Tag has a many-to-many relationship with ConversionFunnel through a join table (ConversionFunnelTag)
        Tag.belongsToMany(models.ConversionFunnel, { through: 'ConversionFunnelTag', foreignKey: 'tagId' });
    };

    return Tag;
};