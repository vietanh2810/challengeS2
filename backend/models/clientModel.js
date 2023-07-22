// models/Client.js
module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Client.associate = (models) => {
        Client.hasMany(models.User, { foreignKey: 'clientId', allowNull: true });
    };

    return Client;
};
