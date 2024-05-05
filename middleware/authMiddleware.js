const ApiError = require("../errors/ApiError");
const tokenService = require("../service/user-service/tokenService");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return ApiError.Unauthorized();
    }
    const decode = tokenService.validationAccessToken(token);
    req.user = decode;
    next();
  } catch (e) {
    return next(ApiError.Unauthorized());
  }
};
