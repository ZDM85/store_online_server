const basketService = require("../service/basketService");

class BasketController {
  async move(req, res, next) {
    try {
      const { deviceId } = req.query;
      const { id } = req.user;
      const device = await basketService.moveDevice(id, deviceId);
      return res.json(device);
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.user;
      const basket = await basketService.getBasket(id);
      return res.json(basket);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const device = await basketService.deleteDeviceBasket(id);
      return res.json(device);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController();
