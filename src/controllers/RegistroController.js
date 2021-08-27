const { RegistroModel, VacinaModel } = require("../models");
const { getToken } = require("../middlewares");
const Vacina = require("../models/vacina");

class RegistroController {
  async create(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { idvacina, data } = req.body;
    idvacina = (idvacina || "").toString().replace(/[^\d]+/g, "");
    data = (data || "").toString().trim();
    if (idvacina === "") {
      return res.status(400).json({ error: ["Vacina não identificada"] });
    }
    if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(data)) {
      return res
        .status(400)
        .json({ error: ["Forneça a data no formato AAAA-MM-DD"] });
    }

    return await VacinaModel.findOne({ where: { idvacina } })
    .then( async (vacina) => {
        if( vacina ){
            const registro = await RegistroModel.create({
            idvacina,
            idusuario: token.idusuario,
            data,
            });
            if( registro ){
               return res.status(200).json({ idregistro:registro.idregistro, idusuario:registro.idusuario, idvacina:registro.idvacina, data: registro.data });
            }
            else{
                return res.status(400).json({error: ["Não foi possível fazer o registro"]});
            }
        }
        else{
            return res.status(400).json({error: ["Vacina não cadastrada"]});
        }
    })
    .catch((err) => {
        try {
        return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
        });
        } catch (e) {
        return res.status(400).json({ error: [e.message] });
        }
    });
  }

  async update(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { idregistro, idvacina, data } = req.body;
    idregistro = (idregistro || "").toString().replace(/[^\d]+/g, "");
    idvacina = (idvacina || "").toString().replace(/[^\d]+/g, "");
    data = (data || "").toString().trim();
    if (idvacina === "") {
      return res.status(400).json({ error: ["Registro não identificado"] });
    }
    if (idvacina === "") {
      return res.status(400).json({ error: ["Vacina não identificada"] });
    }
    if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(data)) {
      return res.status(400).json({ error: ["Forneça a data no formato AAAA-MM-DD"] });
    }

    return await RegistroModel.findOne({ where: { idregistro, idusuario:token.idusuario } })
      .then(async (registro) => {
        if (registro) {
            const vacina = await VacinaModel.findOne({ where: { idvacina } });
            if ( vacina ){
                await registro.update({ idvacina, data });
                return res.status(200).json({ idregistro:registro.idregistro, idusuario:registro.idusuario, idvacina:registro.idvacina, data: registro.data });
            }
            else{
                return res.status(400).json({error: ["Vacina não cadastrada"]});
            }
        }
        return res.status(400).json({ error: ["Registro não identificado"] });
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }
  
  async remove(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { idregistro } = req.body;
    idregistro = (idregistro || "").toString().replace(/[^\d]+/g, "");
    if (idregistro === "") {
      return res.status(400).json({ error: ["Registro não identificado"] });
    }

    return await RegistroModel.findOne({ where: { idregistro, idusuario:token.idusuario } })
      .then(async (registro) => {
        if (registro !== null) {
          await registro.destroy();
          return res.status(200).json({ idregistro });
        } else {
          return res.status(400).json({ error: ["Registro inexistente"] });
        }
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async list(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { limit, offset } = req.body;
    return await RegistroModel.findAndCountAll({
      where: { idusuario:token.idusuario },
      attributes: ["idvacina", "data"],
      order: [["data", "DESC"]],
      offset,
      limit,
    })
      .then((registros) => {
        return res.status(200).json({
            registros: registros.rows.map((item) => item.get()),
          count: registros.count,
        });
      })
      .catch((e) => {
        return res.status(400).json({ error: [e.message] });
      });
  }
}

module.exports = RegistroController;
