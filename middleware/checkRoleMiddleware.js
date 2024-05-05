const ApiError = require("../errors/ApiError");
const tokenService = require("../service/user-service/tokenService");

module.exports = (role) => {
  return async (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return next(ApiError.Unauthorized());
      }
      const decode = tokenService.validationAccessToken(token);
      if (!decode.roles.map((i) => i === role)) {
        return next(ApiError.Forbbiden());
      }
      req.user = decode;
      next();
    } catch (e) {
      return next(ApiError.Unauthorized());
    }
  };
};
