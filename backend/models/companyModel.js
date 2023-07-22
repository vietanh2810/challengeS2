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
    }, { timestamps: true });

    Company.associate = (models) => {
        // Company has a one-to-one relationship with User
        Company.hasOne(models.User, { foreignKey: 'companyId', allowNull: false });
    };

    return Company;
};
