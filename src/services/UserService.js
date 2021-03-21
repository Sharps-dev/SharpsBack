const { AppError } = require("../helpers/AppError");
const Service = require("./Service");
/**
 * UserService class
 * @param {MongooseModel} model
 */
class UserService extends Service {
  constructor(model) {
    super(model);
    this.login = this.login.bind(this);
  }
  /**
   * login function user
   * @param {String} data
   */
  async login(data) {
    const { username, password, email } = data;
    const user = await this.model.findOne({ $or: [{ email }, { username }] });
    if (!user) throw new AppError("invalid credentials", 400);
    const checkUserPassword = await user.checkPassword(password);
    if (!checkUserPassword) throw new AppError("invalid credentials", 400);

    const token = user.generateToken();
    return { user, token };
  }
}

module.exports = UserService;
