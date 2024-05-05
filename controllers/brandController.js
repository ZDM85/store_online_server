const brandService = require("../service/brandService");

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const brand = await brandService.createBrand(name);
      return res.json(brand);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const brands = await brandService.getBrands();
      return res.json(brands);
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const brand = await brandService.deleteBrand(id);
      return res.json(brand);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BrandController();
