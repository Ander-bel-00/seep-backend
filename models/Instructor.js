const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Crear el modelo Instructor con los campos necesarios.
const Instructor = sequelize.define('Instructores', {
    id_instructor: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    numero_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Asegúrate de que el número de documento sea único
        validate: {
            len: {
                args: [7, 10],
                msg: 'El número de documento debe tener entre 7 y 10 dígitos'
            }
        },
    },
    tipo_documento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero_celular1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [10, 10],
                msg: 'El número de celular debe tener 10 dígitos'
            }
        }
    },
    numero_celular2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [10, 10],
                msg: 'El número de celular debe tener 10 dígitos'
            }
        }
    },
    fichas_asignadas: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const value = this.getDataValue('fichas_asignadas');
            return value ? value.split(',') : [];
        },
        set(val) {
            if (Array.isArray(val)) {
                this.setDataValue('fichas_asignadas', val.join(','));
            } else if (typeof val === 'string') {
                this.setDataValue('fichas_asignadas', val);
            } else {
                this.setDataValue('fichas_asignadas', '');
            }
        }
    },
    rol_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8],
                msg: "La contraseña debe ser mínimo de 8 dígitos"
            }
        },
    },
    contrasena_temporal: {
        type: DataTypes.BOOLEAN,
    }
}, {
    sequelize,
    modelName: 'Instructores',
    indexes: [
        // Agregar un índice a la columna id_instructor
        {
            unique: true,
            fields: ['id_instructor', 'numero_documento']
        }
    ]
});

module.exports = Instructor;
