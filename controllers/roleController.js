const roleService = require("../service/roleService");

class RoleController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const role = await roleService.createRole(name);
      return res.json(role);
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const role = await roleService.getRoles();
      return res.json(role);
    } catch (e) {
      next(e);
    }
  }

  async getRoles(req, res, next) {
    try {
      const { id } = req.user;
      const role = await roleService.getRoleUser(id);
      return res.json(role);
    } catch (e) {
      next(e);
    }
  }

  async add(req, res, next) {
    try {
      const { userId, roleId } = req.query;
      const role = await roleService.addRole(userId, roleId);
      return res.json(role);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { userId, roleId } = req.query;
      const role = await roleService.deleteRole(userId, roleId);
      return res.json(role);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RoleController();
