//importa o arquivo database/index.js
const database = require("../database");

const VacinaModel = require("./vacina");
const RegistroModel = require("./registro");

VacinaModel.hasMany(RegistroModel, {
	foreignKey: {
		name: "idvacina",
		allowNull: false,
	},
	sourceKey: "idvacina",
	onDelete: "restrict",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
});
RegistroModel.belongsTo(VacinaModel, {
	foreignKey: "idvacina",
	targetKey: "idvacina",
});

//cria as tabelas no SGBD se elas não existirem
database.sync();

// importa e exporta
module.exports = {
	UsuarioModel: require("./usuario"),
	VacinaModel: require("./vacina"),
	RegistroModel: require("./registro"),
};
