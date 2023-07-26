//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize({
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "123456",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require('./userModel')(sequelize, DataTypes)
db.companies = require('./companyModel')(sequelize, DataTypes)
db.websites = require('./websiteModel')(sequelize, DataTypes)
db.tags = require('./tagModel')(sequelize, DataTypes)
db.kpis = require("./kpiModel")(sequelize, DataTypes);
db.graphes = require("./grapheModel")(sequelize, DataTypes);
db.heatmaps = require("./heatmapModel")(sequelize, DataTypes);
db.conversionFunnel = require('./conversionFunnelModel')(sequelize, DataTypes)
// db.conversionFunnelTag = require('./conversionFunnelTagModel')(sequelize, DataTypes)


//exporting the module
module.exports = db;
