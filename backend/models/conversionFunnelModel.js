module.exports = (sequelize, DataTypes) => {
    const ConversionFunnel = sequelize.define("conversionFunnel", {
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // This should be the table name of the User model
                key: 'id',      // This should be the primary key of the User model
            },
        },

    }, { timestamps: true });

    /*ConversionFunnel.associate = (models) => {
        // ConversionFunnel has a many-to-many relationship with Tag through a join table (ConversionFunnelTag)
        ConversionFunnel.belongsToMany(models.Tag, { through: 'ConversionFunnelTag', foreignKey: 'funnelId' });
    };*/

    return ConversionFunnel;
};
