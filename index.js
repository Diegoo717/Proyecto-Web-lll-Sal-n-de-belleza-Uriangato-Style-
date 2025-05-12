const sequelize = require('./back-end app/config/database');
const Cita = require('./back-end app/models/cita');
const Hombre = require('./back-end app/models/Hombre');
const Mujer = require('./back-end app/models/Mujer');
const Niño = require('./back-end app/models/Niño')

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Base de datos sincronizada.");
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
};

syncDatabase();

module.exports = { Cita, Hombre, Mujer, Niño };
