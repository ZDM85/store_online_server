const rateService = require("../service/rateService");

class RateController {
  async create(req, res, next) {
    try {
      const { rate, deviceId } = req.query;
      const { id } = req.user;
      const rateDate = await rateService.createRate(id, rate, deviceId);
      return res.json(rateDate);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RateController();
