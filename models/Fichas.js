const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fichas = sequelize.define('Fichas', {
    id_ficha: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    numero_ficha: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    programa_formacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nivel_formacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    titulo_obtenido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombre_regional: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    centro_formacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_inicio_lectiva: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_fin_lectiva: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    id_instructor: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Instructores', // Nombre de la tabla en la base de datos
            key: 'id_instructor',
        },
    },
}, {
    sequelize,
    modelName: 'Fichas'
});

module.exports = Fichas;
