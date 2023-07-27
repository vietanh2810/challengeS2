module.exports = (sequelize, DataTypes) => {
    const conversionFunnelTag = sequelize.define('conversionFunnelTag', {
        funnelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'conversionFunnels',
                key: 'id'
            }
        },
        tagId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'tags',
                key: 'tag_uid'
            }
        }
    });
    return conversionFunnelTag;
};