const sequelize = require('../config/database');
const Cita = require('./cita');
const Hombre = require('./Hombre');
const Mujer = require('./Mujer');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Base de datos sincronizada.");
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
};

syncDatabase();

module.exports = { Cita, Hombre, Mujer };
