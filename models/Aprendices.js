const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Fichas = require("../models/Fichas");
const Empresa = require("../models/Empresa");

// Crear el modelo aprendiz con el que se creará la tabla con los campos necesarios.
const Aprendiz = sequelize.define(
  "Aprendices",
  {
    id_aprendiz: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    id_empresa: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Empresa,
        key: "id_empresa",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    numero_documento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        len: {
          args: [7, 10],
          msg: "El número de documento debe ser de 7 a 10 dígitos",
        },
      },
    },
    tipo_documento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_expedicion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lugar_expedicion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
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
    sexo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion_domicilio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    municipio_domicilio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento_domicilio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefonofijo_Contacto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: {
          args: [7, 7],
          msg: "El número de telefono fijo debe tener 7 dígitos",
        },
      },
    },
    numero_celular1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [10, 10],
          msg: "El número de celular debe tener 10 dígitos",
        },
      },
    },
    numero_celular2: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [10, 10],
          msg: "El número de celular debe tener 10 dígitos",
        },
      },
    },
    correo_electronico1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo_electronico_sofia_plus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_ficha: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Fichas,
        key: "numero_ficha",
      },
    },
    rol_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
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
  },
  {
    sequelize,
    modelName: "Aprendices",
    indexes: [
      // Agregar un índice a la columna id_aprendiz
      {
        unique: true,
        fields: ["id_aprendiz", "numero_documento"],
      },
    ],
  }
);

// Exportar el modelo para permitir su uso.
module.exports = Aprendiz;
