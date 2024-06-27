const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Aprendiz = require('./Aprendices');

// Crear modelo de documentos para crear la tabla en la base de datos.

const Documentos = sequelize.define('Documentos', {
    id_documento: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tipo_documento: {
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
},{
    sequelize,
    modelName: 'Documentos'
});


module.exports = Documentos;