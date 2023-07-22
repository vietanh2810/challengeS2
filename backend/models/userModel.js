module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true, // checks for email format
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "user" // Default role can be set as "user"
        },
        isValidated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        contactInfo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
        { timestamps: true });

    User.associate = (models) => {
        // User has a one-to-one relationship with Company
        User.hasOne(models.Company, { foreignKey: 'userId', allowNull: false });

        // User has a one-to-many relationship with Website
        User.hasMany(models.Website, { foreignKey: 'userId', allowNull: false });

        // User has a one-to-many relationship with Kpi
        User.hasMany(models.Kpi, { foreignKey: 'userId', allowNull: false });

        // User has a one-to-many relationship with Graph
        User.hasMany(models.Graph, { foreignKey: 'userId', allowNull: false });

        // User has a one-to-many relationship with Heatmap
        User.hasMany(models.Heatmap, { foreignKey: 'userId', allowNull: false });
    };

    return User;
};
