const Controller = require("./Controller");
const UserService = require("./../services/UserService");
const User = require("./../models/User");
const { AppError } = require("../helpers/AppError");

const userService = new UserService(User);

class UserController extends Controller {
  constructor(service) {
    super(service);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.update = this.update.bind(this);
    this.logout = this.logout.bind(this);
    this.logoutAll = this.logoutAll.bind(this);
  }
  /**
   *
   * @param {String} req
   * @param {String} res
   * @returns {Json} res
   */
  async login(req, res, next) {
    try {
      const { password, email, username } = req.body;
      if (!password || (!email && !username)) throw new AppError("عبارات وارد شده صحیح نیستند", 400);

      const response = await this.service.login(req.body);
      return res.status(200).send(response).end();
    } catch (err) {
      next(err);
    }
  }

  async signUp(req, res, next) {
    try {
      const { password, username, email } = req.body;
      if (!password || !email || !username) throw new AppError("لطفا موارد الزامی را وارد نمایید", 400);
      else {
        const newUser = await this.service.insert(req.body);
        return res
          .status(201)
          .json({
            user: newUser,
            token: newUser.generateToken(),
          })
          .end();
      }
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const validUpdate = ["firstname", "lastname", "password", "avatar"];
      const { body } = req;
      if (Object.keys(body).length == 0) next(new AppError("enter some valid thing", 400));
      const validObject = {};
      validUpdate.forEach((v) => {
        if (body[v]) validObject[v] = body[v];
      });
      if (Object.keys(validObject).length == 0) throw new AppError("enter some valid thing", 400);
      const { user } = req;
      const result = await this.service.update(user._id, validObject);
      if (!result) throw new AppError("somthing wrong", 400);
      else return res.status(204).json({ message: "updated successfully " }).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const result = await this.service.logout(req);
      return res.status(200).json(result).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  async logoutAll(req, res, next) {
    try {
      const { user } = req;
      const result = await this.service.logoutAll(user);
      return res.status(200).json(result).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}

module.exports = new UserController(userService);
