const router = require("express").Router();
const { UsuarioController } = require("../controllers");
const { authMiddleware, adminMiddleware } = require("../middlewares");
const { create, login, updatemail, updatesenha, updateperfil } =
	new UsuarioController();

// curl -X POST -d "mail=teste@teste.com&senha=123456" http://localhost:3100/usuario/create
router.post("/create", create);

// curl -X GET -d "mail=teste@teste.com&senha=123456" http://localhost:3100/usuario/login
router.get("/login", login);

router.use(authMiddleware);

// curl -X PUT -d "mail=tester@teste.com" http://localhost:3100/usuario/update/mail
router.put("/update/mail", updatemail);

// curl -X PUT -d "senha=123457" http://localhost:3100/usuario/update/senha
router.put("/update/senha", updatesenha);

// verifica se o usuário é admin
router.use(adminMiddleware);
// curl -X PUT -d "idusuario=1&perfil=admin" http://localhost:3100/usuario/update/perfil
router.put("/update/perfil", updateperfil);

router.use((req, res) => {
	res.status(400).json({ error: ["Operação desconhecida com o usuário"] });
});

module.exports = router;
