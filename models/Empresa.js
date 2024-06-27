const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Empresa = sequelize.define('Empresa', {
    id_empresa: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    razon_social: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nit_empresa: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    direccion_empresa: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    nombre_jefe_inmediato: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos_jefe_inmediato: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cargo_jefe_inmediato: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono_jefe_inmediato: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [10,10],
                msg: 'El número de celular debe tener 10 dígitos'
            }
        }
    },
    email_jefe_imediato: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'Empresa',
    indexes: [
        {
            unique: true,
            fields: ['id_empresa', 'nit_empresa']
        }
    ]
});

module.exports = Empresa;
