const Controller = require("./Controller");
const UserService = require("./../services/UserService");
const User = require("./../models/User");

const userService = new UserService(User);

class UserController extends Controller {
  constructor(service) {
    super(service);
    this.login = this.login.bind(this);
  }
  /**
   *
   * @param {String} req
   * @param {String} res
   * @returns {Json} res
   */
  async login(req, res) {
    const { password, email } = req;
    if (!password || !email) return res.status(400).json({ error: true, status: 400, message: "email and  password are essential" }).end();
    const response = await this.service.login(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(200).send(response).end();
  }
}

module.exports = new UserController(userService);
