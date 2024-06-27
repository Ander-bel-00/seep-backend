const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Admin = sequelize.define(
  "Admin",
  {
    id_admin: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "Admin",
    indexes: [
      {
        unique: true,
        fields: ['id_admin', 'numero_documento'],
      },
    ],
  }
);

module.exports = Admin;
