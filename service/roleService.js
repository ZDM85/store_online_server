const UserDto = require("../dtos/UserDto");
const ApiError = require("../errors/ApiError");
const { Role, User, UserRole } = require("../models/model");

class RoleService {
  async createRole(name) {
    const condidate = await Role.findOne({ where: { name } });
    if (condidate) {
      throw ApiError.BadRequest("Роль с таким именем уже существует!");
    }
    const role = await Role.create({ name });
    return role;
  }

  async getRoles() {
    const roles = await Role.findAll();
    return roles;
  }

  async getRoleUser(id) {
    const roles = await UserRole.findAll({ where: { userId: id } });
    return roles;
  }

  async addRole(userId, roleId) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден!");
    }
    const userRoleFromDB = await this.searchRoleFromDb(userId, roleId);
    let roles = userRoleFromDB.map((i) => i.roleId);
    console.log(roles);
    console.log(roleId);
    if (roles.map((i) => i === roleId)) {
      if (roles.length === 0) {
        const roleAddUser = await UserRole.create({ userId, roleId });
        const roleName = await Role.findOne({
          where: { id: roleAddUser.roleId },
        });
        user.roles = [...user.roles, roleName.name];
        await user.save();
        return user.roles;
      }
      throw ApiError.BadRequest("Такая роль есть у пользователя!");
    }
    const roleAddUser = await UserRole.create({ userId, roleId });
    const roleName = await Role.findOne({ where: { id: roleAddUser.roleId } });
    user.roles = [...user.roles, roleName.name];
    await user.save();
    return user.roles;
  }

  async deleteRole(id, roleId) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден!");
    }
    if (user.roles.map((i) => i === roleId)) {
      const roleName = await Role.findOne({ where: { id: roleId } });
      let sortRole = [];
      for (let i of user.roles) {
        if (i !== roleName.name) {
          sortRole.push(i);
        }
      }
      user.roles = sortRole;
      await user.save();
    } else {
      throw ApiError.BadRequest("Такой роли нет у пользователя!");
    }
    const userRoleFromDB = await this.searchRoleFromDb(id, roleId);
    if (userRoleFromDB.map((i) => i === roleId)) {
      let role = await UserRole.findOne({ where: { roleId } });
      if (!role) {
        throw ApiError.BadRequest("Такой роли нет у пользователя!");
      }
      role.destroy();
      await role.save();
    }
    return user.roles;
  }

  async searchRoleFromDb(id, roleId) {
    const userRoleFromDB = await UserRole.findAll({
      where: { userId: id, roleId },
    });
    return userRoleFromDB;
  }
}

module.exports = new RoleService();
