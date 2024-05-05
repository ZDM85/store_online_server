const jwt = require("jsonwebtoken");
const { User, Token } = require("../../models/model");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  validationAccessToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
      return tokenData;
    } catch (e) {
      return null;
    }
  }

  validationRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
      return tokenData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const token = await Token.destroy({ where: { refreshToken } });
    return token;
  }

  async findToken(refToken) {
    const token = await Token.findOne({ where: { refreshToken: refToken } });
    console.log(token);
    return token;
  }
}

module.exports = new TokenService();
