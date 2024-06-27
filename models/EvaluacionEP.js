const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Aprendiz = require("./Aprendices");

const EvaluacionEP = sequelize.define(
  "Evaluaciones",
  {
    id_evaluacion: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // LLave foranea a la tabla aprenidces
    id_aprendiz: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Aprendiz,
        key: "id_aprendiz",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    actividades_desarrollar: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    evidencias_aprendizaje: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    fecha_actividad: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    lugar_actividad: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    observaciones_actividades: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre_ente_conformador: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre_instructor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firma_ente_conformador: {
      type: DataTypes.TEXT, // use TEXT to store large data if needed
      allowNull: true,
    },
    firma_aprendiz: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    firma_instructor_seguimiento: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipo_informe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inicio_periodo_evaluado: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fin_periodo_evaluado: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    relaciones_in_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relaciones_in_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relaciones_in_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trabajo_equip_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trabajo_equip_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trabajo_equip_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    solucion_prob_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    solucion_prob_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    solucion_prob_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cumplimiento_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cumplimiento_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cumplimiento_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizacion_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizacion_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizacion_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trasnfe_cono_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trasnfe_cono_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trasnfe_cono_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mejora_conti_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mejora_conti_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mejora_conti_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fort_ocup_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fort_ocup_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fort_ocup_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oport_calidad_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oport_calidad_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oport_calidad_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respo_ambient_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respo_ambient_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respo_ambient_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admin_recursos_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admin_recursos_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admin_recursos_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seg_ocupacional_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seg_ocupacional_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seg_ocupacional_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    docs_etapro_satisfactorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    docs_etapro_por_mejorar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    docs_etapro_observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Observaciones_ente_conf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observaciones_aprendiz: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    juicio_aprendiz: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recono_especiales: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    especificar_recono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Evaluaciones",
    indexes: [
      {
        unique: true,
        fields: ["id_evaluacion"],
      },
    ],
  }
);

module.exports = EvaluacionEP;
