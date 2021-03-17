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
}

/**
 * login function user
 * @param {String} data
 */
async function login(data) {
  try {
    const { password, email } = data;
    const user = await this.model.findOne({ email });
    if (!user)
      return {
        error: true,
        status: 400,
        message: "check your email",
      };
    const checkUserPassword = await user.checkPassword(password);
    if (!checkUserPassword)
      return {
        error: true,
        status: 400,
        message: "check your password",
      };
    return {
      error: false,
      statusCode: 200,
      data: user,
    };
  } catch (errors) {
    console.error(errors);
    return {
      error: true,
      status: 400,
      message: "check input valid thing",
    };
  }
}

module.exports = UserService;
