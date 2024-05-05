const ApiError = require("../errors/ApiError");
const { Brand } = require("../models/model");

class BrandService {
  async createBrand(name) {
    const condidate = await Brand.findOne({ where: { name } });
    if (condidate) {
      throw ApiError.BadRequest("Такое название бренда уже существует!");
    }
    const brand = await Brand.create({ name });
    return brand;
  }

  async getBrands() {
    const brands = await Brand.findAll();
    if (!brands) {
      throw ApiError.BadRequest("Бренды не найдены!");
    }
    return brands;
  }

  async deleteBrand(id) {
    const brand = await Brand.findOne({ where: { id } });
    if (!brand) {
      throw ApiError.BadRequest("Бренды не найдены!");
    }
    await brand.destroy();
    return { message: "Бренд удален!" };
  }
}

module.exports = new BrandService();
