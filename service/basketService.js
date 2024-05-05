const ApiError = require("../errors/ApiError");
const { BasketDevice, Basket, Device } = require("../models/model");

class BasketService {
  async moveDevice(id, deviceId) {
    const condidate = await BasketDevice.findOne({ where: { deviceId } });
    if (condidate) {
      throw ApiError.BadRequest("Устройство уже есть в корзине!");
    }
    const basket = await Basket.findOne({ where: { userId: id } });
    const device = await Device.findOne({ where: { id: deviceId } });
    const basketDevice = await BasketDevice.create({
      basketId: basket.id,
      deviceId,
    });
    return { basketDevice, device };
  }

  async getBasket(userId) {
    const { id } = await Basket.findOne({ where: { userId: userId } });
    if (!id) {
      throw ApiError.BadRequest("Корзина не найдена!");
    }
    const devicesInBasket = await BasketDevice.findAll({
      where: { basketId: id },
    });
    return devicesInBasket;
  }

  async deleteDeviceBasket(id) {
    const device = await BasketDevice.findOne({ where: { deviceId: id } });
    if (!device) {
      throw ApiError.BadRequest("Устройство не найдено в корзине!");
    }
    await device.destroy();
    return { message: "Устройство удалено из корзины!" };
  }
}

module.exports = new BasketService();
