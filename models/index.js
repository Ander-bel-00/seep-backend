const { sequelize } = require("../config/database");

const Admin = require("./Admin");
const Aprendiz = require("./Aprendices");
const Bitacora = require("./Bitacoras");
const Documento = require("./Documentos");
const Ficha = require("./Fichas");
const Instructor = require("./Instructor");
const Visita = require("./Visita");
const EvaluacionEP = require("./EvaluacionEP");
const Empresa = require("./Empresa");

// Define las relaciones aquí

const AdminFichaAprendizInstructor = require("./AdminFichaAprendizInstructor");

Admin.belongsToMany(Ficha, { through: AdminFichaAprendizInstructor });
Ficha.belongsToMany(Admin, { through: AdminFichaAprendizInstructor });

Admin.belongsToMany(Aprendiz, { through: AdminFichaAprendizInstructor });
Aprendiz.belongsToMany(Admin, { through: AdminFichaAprendizInstructor });

Admin.belongsToMany(Instructor, { through: AdminFichaAprendizInstructor });
Instructor.belongsToMany(Admin, { through: AdminFichaAprendizInstructor });

Instructor.hasMany(Ficha, {
  foreignKey: "id_instructor",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Ficha.belongsTo(Instructor, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Aprendiz.belongsTo(Ficha, {
  foreignKey: "numero_ficha",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Ficha.hasMany(Aprendiz, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Bitacora.belongsTo(Aprendiz, {
  foreignKey: "id_aprendiz",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Aprendiz.hasMany(Bitacora, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Documento.belongsTo(Aprendiz, {
  foreignKey: "id_aprendiz",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Aprendiz.hasMany(Documento, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Visita.belongsTo(Aprendiz, { foreignKey: "id_aprendiz" });
Aprendiz.hasMany(Visita,{ onDelete: "CASCADE", onUpdate: "CASCADE" });

Aprendiz.hasOne(EvaluacionEP, {
  foreignKey: "id_aprendiz",
  sourceKey: "id_aprendiz",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EvaluacionEP.belongsTo(Aprendiz, {
  foreignKey: "id_aprendiz",
  targetKey: "id_aprendiz",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Instructor.hasMany(Ficha, {
  foreignKey: 'id_instructor',
  as: 'fichas',
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Ficha.belongsTo(Instructor, {
  foreignKey: 'id_instructor',
  as: 'instructor',
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  sequelize,
  Admin,
  Aprendiz,
  Bitacora,
  Documento,
  Empresa,
  Ficha,
  Instructor,
  Visita,
  EvaluacionEP,
};
