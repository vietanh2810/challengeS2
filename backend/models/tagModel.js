module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define("tag", {
        tag_uid : {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
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
        }
    }, { timestamps: true });

    /*Tag.associate = (models) => {
        // Tag has a many-to-many relationship with ConversionFunnel through a join table (ConversionFunnelTag)
        Tag.belongsToMany(models.ConversionFunnel, { through: 'ConversionFunnelTag', foreignKey: 'tagId' });
    };*/

    return Tag;
};
