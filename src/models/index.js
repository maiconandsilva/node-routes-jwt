const UsuarioModel = require("./usuario");
const VacinaModel = require("./vacina");
const RegistroModel = require("./registro");

//importa o arquivo database/index.js
const database = require("../database");

UsuarioModel.hasMany(RegistroModel, {
  foreignKey: {
    name: "idusuario",
    allowNull: false,
  },
  sourceKey: "idusuario",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true, //usado para forçar o cascade no onDelete
});
RegistroModel.belongsTo(UsuarioModel, {
  foreignKey: "idusuario",
  targetKey: "idusuario",
});

VacinaModel.hasMany(RegistroModel, {
  foreignKey: {
    name: "idvacina",
    allowNull: false,
  },
  sourceKey: "idvacina",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true, //usado para forçar o cascade no onDelete
});
RegistroModel.belongsTo(VacinaModel, {
  foreignKey: "idvacina",
  targetKey: "idvacina",
});

//cria as tabelas no SGBD se elas não existirem
database.sync();

module.exports = {
  UsuarioModel,
  VacinaModel,
  RegistroModel
};
