const ApiError = require("../errors/ApiError");
const { Type } = require("../models/model");

class TypeService {
  async createType(name) {
    const condidate = await Type.findOne({ where: { name } });
    if (condidate) {
      throw ApiError.BadRequest("Такое название типа уже существует!");
    }
    const type = await Type.create({ name });
    return type;
  }

  async getTypes() {
    const types = await Type.findAll();
    if (!types) {
      throw ApiError.BadRequest("Типы не найдены!");
    }
    return types;
  }

  async deleteType(id) {
    const type = await Type.findOne({ where: { id } });
    if (!type) {
      throw ApiError.BadRequest("Тип не найден!");
    }
    await type.destroy();
    return { message: "Тип удален!" };
  }
}

module.exports = new TypeService();
