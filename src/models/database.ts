const Sequelize = require('sequelize');

export const sequelize = new Sequelize('db_rafael_pinheiro', 'useradmin', 'admin@123', {
    host: "serverdbp2.mysql.database.azure.com",
    port: "3306",
    dialect: "mysql"
});

export { Sequelize };