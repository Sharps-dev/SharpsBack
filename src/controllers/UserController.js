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
      if (!password || (!email && !username)) throw new AppError("invalid credentials", 400);

      const response = await this.service.login(req.body);
      return res.status(200).send(response).end();
    } catch (err) {
      next(err);
    }
  }

  async signUp(req, res, next) {
    try {
      const { password, username, email } = req.body;
      if (!password || !email || !username) throw new AppError("please insert essential field", 400);
      else {
        const newUser = await this.service.insert(req.body);
        return res
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
}

module.exports = new UserController(userService);
