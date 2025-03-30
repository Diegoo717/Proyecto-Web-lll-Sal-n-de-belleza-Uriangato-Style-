const sequelize = require('../config/database');
const Cita = require('./Cita');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Base de datos sincronizada.");
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
};

syncDatabase();

module.exports = { Cita };
