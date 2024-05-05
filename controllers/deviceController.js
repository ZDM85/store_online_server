const deviceService = require("../service/deviceService");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      const device = await deviceService.createDevice(
        name,
        price,
        brandId,
        typeId,
        img,
        info
      );
      return res.json(device);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      const { brandId, typeId, page, limit } = req.query;
      const devices = await deviceService.getDevices(
        brandId,
        typeId,
        page,
        limit
      );
      return res.json(devices);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.getOneDevice(id);
      return res.json(device);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const device = await deviceService.deleteDevice(id);
      return res.json(device);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DeviceController();
