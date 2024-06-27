const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdminFichaAprendizInstructor = sequelize.define('AdminUsers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    adminId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    fichaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    aprendizId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    instructorId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'AdminUsers',
    indexes: [
        {
            unique: true,
            fields: ['AdminNumeroDocumento', 'instructorId'], // Aquí cambiamos el nombre de la columna
            name: 'AdminUsersUniq'
        }
    ]
});

module.exports = AdminFichaAprendizInstructor;
