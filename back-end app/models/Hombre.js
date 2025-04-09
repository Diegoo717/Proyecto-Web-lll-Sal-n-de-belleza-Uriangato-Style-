const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hombre = sequelize.define('Hombre', {
    DirecImgServicio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NombreServicio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CostoServicio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            // Esto asegura que siempre devuelva un número
            const value = this.getDataValue('CostoServicio');
            return parseFloat(value);
        }
    },
    DescripcionServicio: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Hombres' 
});

module.exports = Hombre;