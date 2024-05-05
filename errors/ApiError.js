class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static Unauthorized() {
    return new ApiError(401, "Пользователь не авторизован!");
  }

  static Forbbiden() {
    return new ApiError(403, "Нет доступа!");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}

module.exports = ApiError;
