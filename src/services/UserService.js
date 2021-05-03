const mongoose = require("mongoose");
const { AppError } = require("../helpers/AppError");
const Service = require("./Service");
const contentService = new (require("./ContentService"))(require("../models/Content"));
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
    
    async getSuggestions(user, { skip = 0, limit = 10 }) {
        const total = user.suggestions.length;

        await user.populate({
            path: 'suggestions',
            domain: { $nin: user.blockedDomains },
            options: {
                limit,
                skip,
                sort: { 'createdAt': -1 }
            }
        }).execPopulate();

        return {
            items: user.suggestions,
            total
        };
    }
    async getDefaultSuggestions(user, { skip = 0, limit = 10 }) {
        const query = {
            skip: Number(skip),
            limit: Number(limit),
            domain: { $nin: user.blockedDomains }
        };
        return await contentService.getAll(query);
    }

    async addSavedContent(user, contentId) {
        user.savedContents.push(contentId);
        await user.save();
    }
    async removeSavedContent(user, contentId) {
        const contentIndex = user.savedContents.indexOf(contentId);
        if (contentIndex == -1) return false;
        user.savedContents.splice(contentIndex, 1);
        await user.save();
        return true;
    }
    async getSavedContents(user, { skip = 0, limit = 10 }) {

        const total = user.savedContents.length;
        await user.populate({
            path: 'savedContents',
            options: {
                limit,
                skip,
            }
        }).execPopulate();

        return {
            items: user.savedContents,
            total
        };
    }

    async getHistory(user) {

        const HISTORY_COUNT = 50;

        await user.populate({
            path: 'history',
            options: {
                limit: HISTORY_COUNT,
                sort: { 'createdAt': -1 }
            },
            populate: { path: 'content'}
        }).execPopulate();

        return user.history;
    }

    async setBlockedDomains(user, domains) {
        user.blockedDomains = domains;
        await user.save();
    }
    async addBlockedDomain(user, domain) {
        user.blockedDomains.push(domain);//check duplicates?
        await user.save();
    }
    getBlockedDomains(user) { return user.blockedDomains; }
}

module.exports = UserService;
