const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Aprendiz = require('./Aprendices');

const Bitacoras = sequelize.define('Bitacoras', {
    id_bitacora: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    numero_de_bitacora: {
        type: DataTypes.STRING,
        allowNull: false
    },
    archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_aprendiz: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Aprendiz,
            key: 'id_aprendiz'
        }
    },
    observaciones: {
        type: DataTypes.TEXT,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    intentos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    sequelize,
    modelName: 'Bitacoras'
});


module.exports = Bitacoras;