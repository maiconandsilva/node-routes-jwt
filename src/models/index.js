//importa o arquivo database/index.js
const database = require("../database");

//cria as tabelas no SGBD se elas não existirem
database.sync();

// importa e exporta
module.exports = {
	UsuarioModel: require("./Usuario"),
	VacinaModel: require("./Vacina"),
	RegistroModel: require("./Registro"),
};
