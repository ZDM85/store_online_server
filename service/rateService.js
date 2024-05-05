const ApiError = require("../errors/ApiError");
const { Device, Rating } = require("../models/model");

class RateService {
  async createRate(id, rate, deviceId) {
    const device = await Device.findOne({ where: { id: deviceId } });
    if (!device) {
      throw ApiError.BadRequest("Устройство не найдено!");
    }
    device.rating = rate;
    await device.save();
    const rating = await Rating.create({ rate, userId: id });
    return {
      device,
      rating,
    };
  }
}

module.exports = new RateService();
