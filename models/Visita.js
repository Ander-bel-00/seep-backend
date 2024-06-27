const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Aprendiz = require('./Aprendices');

const Visitas = sequelize.define('Visitas', {
    id_visita: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tipo_visita: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: true // Permitir valores nulos para la hora de finalización
    },
    lugar_visita: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modalidad_visita: {
        type: DataTypes.ENUM,
        values: ['Presencial', 'Virtual'],
        allowNull: false
    },
    motivo_cancelacion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {  // Nuevo campo estado
        type: DataTypes.ENUM,
        values: ['activo', 'cancelado'],
        defaultValue: 'activo'
    },
    aprendiz: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Aprendiz,
            key: 'id_aprendiz'
        }
    },
}, {
    sequelize,
    modelName: 'Visitas'
});

module.exports = Visitas;
