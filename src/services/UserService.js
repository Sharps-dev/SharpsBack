const mongoose = require("mongoose");
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

  async logout({ user, token }) {
    try {
      user.tokens = user.tokens.filter((t) => t != token);
      await user.save();
      return { message: "logout successful" };
    } catch (e) {
      console.error(e);
      throw new AppError("somthing wrong", 500);
    }
  }

  async logoutAll(user) {
    try {
      user.tokens = [];
      await user.save();
      return { message: "logout all devices successful" };
    } catch (e) {
      console.error(e);
      throw new AppError("somthing wrong", 500);
    }
  }

    /**
     * Sets an array of content ObjectIds as user.suggestions.
     * @param {mongoose.Document} user
     * @param {[mongoose.Types.ObjectId]} contentIds
     */
    async addSuggestions(user, contentIds) {
        user.suggestions = [...new Set(contentIds)];
        await user.save();
    }
    /**
     * 
     * @param {mongoose.Document} user
     * @param {Object} options
     * @param {Number} options.skip
     * @param {Number} options.limit
     */
    async getSuggestions(user, options) {
        let skip, limit;
        if (options) {
            skip= options.skip;
            limit = options.limit;
        }

        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;
        const total = user.suggestions.length;

        await user.populate({
            path: 'suggestions',
            options: {
                limit,
                skip,
                //sort??
            }
        }).execPopulate();

        return {
            items: user.suggestions,
            total
        };
    }
}

module.exports = UserService;
