module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("company", {
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kbis: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Add userId field to link the Company to the User
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // This should be the table name of the User model
                key: 'id',      // This should be the primary key of the User model
            },
        },
    }, { timestamps: true });

    Company.associate = (models) => {
        // Company belongs to a User
        Company.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Company;
};
