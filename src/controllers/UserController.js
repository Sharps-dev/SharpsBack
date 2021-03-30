const Controller = require("./Controller");
const UserService = require("./../services/UserService");
const User = require("./../models/User");
const { AppError } = require("../helpers/AppError");
const eventEmmiter = require("../helpers/eventEmitter");
const checkToken = require("../utils/jwt/checkToken");

const userService = new UserService(User);

class UserController extends Controller {
  constructor(service) {
    super(service);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
    this.logoutAll = this.logoutAll.bind(this);
      this.verifyAccount = this.verifyAccount.bind(this);
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
            const newUser = await this.service.insert(req.body);
            eventEmmiter.emit('signUp', newUser);
            return res
                .status(201)
                .json({
                    user: newUser,
                    token: newUser.generateToken(),
                })
                .end();

        } catch (err) { next(err); }
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

    async verifyAccount(req, res, next) {
        try {
            const { _id } = await checkToken(req.query.t);
            const user = await this.service.getOne({ _id });
            if (!user)
                throw new AppError('invalid link', 404);

            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
            return res
                .status(200)
                .json("Your account (" + user.email + ") is successfully verified.")
                .end();

        } catch (err) { next(err); }
    }
}

module.exports = new UserController(userService);
