const router = require("express").Router();
const { RegistroController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const { create, update, remove, list } = new RegistroController();

router.use(authMiddleware);

// curl -X POST -d "idvacina=1&data=2021-07-15" http://localhost:3100/registro/create
router.post("/create", create);

// curl -X PUT -d "idregistro=1&idvacina=3&data=2021-08-03" http://localhost:3100/registro/update
router.put("/update", update);

// curl -X GET -d "offset=0&limit=4" http://localhost:3100/registro/list
router.get("/list", list);

// curl -X DELETE -d "idregistro=1" http://localhost:3100/registro/remove
router.delete("/remove", remove);

router.use((req, res) => {
	res.status(400).json({ error: ["Operação desconhecida com o registro"] });
});

module.exports = router;
