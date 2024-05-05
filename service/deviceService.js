const uuid = require("uuid");
const { Device, DeviceInfo } = require("../models/model");
const path = require("path");
const ApiError = require("../errors/ApiError");

class DeviceService {
  async createDevice(name, price, brandId, typeId, img, info) {
    const condidate = await Device.findOne({ where: { name } });
    if (condidate) {
      throw ApiError.BadRequest("Такое название устройства уже существует!");
    }
    let fileName = uuid.v4();
    img.mv(path.resolve(__dirname, "..", "static", fileName));
    const device = await Device.create({
      name,
      price,
      brandId,
      typeId,
      img: fileName,
      info,
    });
    if (info) {
      info = JSON.parse(info);
      info.forEach((i) =>
        DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        })
      );
    }
    return device;
  }

  async getDevices(brandId, typeId, page, limit) {
    page = page || 1;
    limit = limit || 9;
    const offset = page * limit - limit;
    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ offset, limit });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        offset,
        limit,
      });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        offset,
        limit,
      });
    }
    if (typeId && brandId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        offset,
        limit,
      });
    }
    return devices;
  }
  async getOneDevice(id) {
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    if (!device) {
      throw ApiError.BadRequest("Устройтсво не найдено!");
    }
    return device;
  }

  async deleteDevice(id) {
    const device = await Device.findOne({ where: { id } });
    if (!device) {
      throw ApiError.BadRequest("Устройство не найдено!");
    }
    await device.destroy();
    return { message: "Устройство удалено!" };
  }

  async getDevice(id) {
    let device;
    if (id.length < 1) {
      return (device = await Device.findOne({ where: { id } }));
    }
    if (id.length > 1) {
      for (let i = 0; i < id.length; i++) {
        let item = await Device.findOne({ where: { id: id[i] } });
        device = item;
      }
      return device;
    }
    if (!device) {
      throw ApiError.BadRequest("Устройство не найдено!");
    }
    return device;
  }
}

module.exports = new DeviceService();
