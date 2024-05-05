const { User, Basket, Token, Role, UserRole } = require("../../models/model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../../dtos/UserDto");
const ApiError = require("../../errors/ApiError");

class UserService {
  async registration(email, password, role) {
    if (!email || !password) {
      throw ApiError.BadRequest("Некорректрый email или password!");
    }
    const condidate = await User.findOne({ where: { email } });
    if (condidate) {
      throw ApiError.BadRequest(
        `Пользователь с таким ${email} уже существует!`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await User.create({
      email,
      password: hashPassword,
      activationLink,
    });
    if (!role) {
      let roleData;
      const roleUserFromDB = await Role.findOne({ where: { name: "USER" } });
      if (!roleUserFromDB) {
        const roleUser = await Role.create({ name: "USER" });
        roleData = await UserRole.create({
          userId: user.id,
          roleId: roleUser.id,
        });
      } else {
        roleData = await UserRole.create({
          userId: user.id,
          roleId: roleUserFromDB.id,
        });
      }
      const roleName = await Role.findOne({ where: { id: roleData.roleId } });
      user.roles = [roleName.name];
      await user.save();
    } else {
      const roleUserFromDB = await Role.findOne({ where: { name: role } });
      if (!roleUserFromDB) {
        throw ApiError.BadRequest("Такая роль не найдена!");
      }
      let roleData = await UserRole.create({
        userId: user.id,
        roleId: roleUserFromDB.id,
      });
      const roleName = await Role.findOne({ where: { id: roleData.roleId } });
      user.roles = [roleName.name];
      await user.save();
    }
    await mailService.sendActivatationMail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );
    const basket = await Basket.create({ userId: user.id });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({
      ...userDto,
    });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким ${email} не найден!`);
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw ApiError.BadRequest(`Пароль не подходит!`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiError.BadRequest(`Некорректная ссылка активации!`);
    }
    user.isActivated = true;
    await user.save();
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }
    const userData = tokenService.validationRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.Unauthorized();
    }
    const user = await User.findOne({ where: { id: userData.id } });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
