const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Niño = sequelize.define('Niño', {
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
            const value = this.getDataValue('CostoServicio');
            return parseFloat(value);
        }
    },
    DescripcionServicio: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Niños' 
});

module.exports = Niño;