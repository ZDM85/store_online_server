const typeService = require("../service/typeService");

class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      console.log(name);
      const type = await typeService.createType(name);
      return res.json(type);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const types = await typeService.getTypes();
      return res.json(types);
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const type = await typeService.deleteType(id);
      return res.json(type);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TypeController();
