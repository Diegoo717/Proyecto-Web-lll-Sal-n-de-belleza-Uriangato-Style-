const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    servicio: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Cita;
