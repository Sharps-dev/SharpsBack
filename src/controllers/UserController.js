const Controller = require("./Controller");
const UserService = require("./../services/UserService");
const User = require("./../models/User");
const { AppError, MissingBodyFieldError } = require("../helpers/AppError");
const eventEmmiter = require("../helpers/eventEmitter");
const checkToken = require("../utils/jwt/checkToken");
const contentService = new (require("../services/ContentService"))(require("../models/Content"));
const mongoose = require("mongoose");

const userService = new UserService(User);

class UserController extends Controller {
  constructor(service) {
    super(service);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.getUser = this.getUser.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.logout = this.logout.bind(this);
    this.logoutAll = this.logoutAll.bind(this);
      this.verifyAccount = this.verifyAccount.bind(this);
      this.requestResetPassword = this.requestResetPassword.bind(this);
      this.updatePassword = this.updatePassword.bind(this);
      this.getSuggestions = this.getSuggestions.bind(this);
      this.addSavedContent = this.addSavedContent.bind(this);
      this.removeSavedContent = this.removeSavedContent.bind(this);
      this.getSavedContents = this.getSavedContents.bind(this);
      this.addBlockedDomain = this.addBlockedDomain.bind(this);
      this.setBlockedDomains = this.setBlockedDomains.bind(this);
      this.getBlockedDomains = this.getBlockedDomains.bind(this);
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
      if (!password || (!email && !username)) throw new AppError("fill in the required fields", 400);

      const response = await this.service.login(req.body);
      return res.status(200).send(response).end();
    } catch (err) {
      next(err);
    }
  }

  async signUp(req, res, next) {
    try {
      const { password, username, email } = req.body;
        if (!password || !email || !username) throw new AppError("fill in the required fields", 400);
      const newUser = await this.service.insert(req.body);
      eventEmmiter.emit("signUp", newUser);
      return res
        .status(201)
        .json({
          user: newUser,
          token: newUser.generateToken(),
        })
        .end();
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const { user } = req;
      return res.status(200).json(user).end();
    } catch (error) {
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

  async delete(req, res, next) {
    try {
      const { user } = req;
      const result = await this.service.delete(user._id);
      if (!result) return res.status(400).json({ error: "check user input" }).end();
      return res.status(204).end();
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

  async verifyAccount(req, res, next) {
    try {
      const { _id } = await checkToken(req.query.t);
      const user = await this.service.getOne({ _id });
      if (!user) throw new AppError("invalid link", 404);

      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
        return res
            .redirect('http://localhost:3000/verify_email');
    } catch (err) {
      next(err);
    }
  }
  async requestResetPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await this.service.getOne({ email });
      if (user && user.isVerified) eventEmmiter.emit("passwordReset", user);

      return res.status(200).json("If the email you specified exists in our system and is verified, we've sent a password reset link to it.").end;
    } catch (err) {
      next(err);
    }
  }
  async updatePassword(req, res, next) {
    try {
      const { password, confirmPassword, token } = req.body;
      if (!token) throw new AppError("Unauthorized", 401);
      if (!password || !confirmPassword) throw new AppError("Fill in the required fields", 400);
      if (password !== confirmPassword) throw new AppError("Passwords do not match", 400);

      const { _id } = await checkToken(token);
      const user = await this.service.getOne({ _id });
      if (!user) throw new AppError("Unauthorized", 401);

      user.password = password;
      await user.save();
      return res.status(200).json("Password is reset successfully.").end();
    } catch (err) {
      next(err);
    }
  }

  async getSuggestions(req, res, next) {
    try {
      const { user } = req;
      let { skip, limit } = req.query;

      let results = await this.service.getSuggestions(user, { skip, limit });
      const itemsLength = results.items.length;
      limit -= itemsLength;
      skip = itemsLength == 0 ? skip - results.total : 0;
      if (skip < 0) skip = 0;

      const defaultResults = await this.service.getDefaultSuggestions(user, { skip, limit });
      results.items = [...results.items, ...defaultResults.items];
      results.total += defaultResults.total;

      return res.status(200).json(results).end();
    } catch (err) {
      next(err);
    }
    }

    async addSavedContent(req, res, next) {
        try {
            const { url } = req.body;
            if (!url) throw new AppError('invalid url', 400);

            const content = await contentService.getOne({ url });
            if (!content) throw new AppError('invalid url', 400);

            await this.service.addSavedContent(req.user, content._id);
            return res.sendStatus(200).end();

        } catch (err) { next(err); }
    }
    async removeSavedContent(req, res, next) {
        try {
            const { url } = req.query;
            if (!url) throw new AppError('invalid url', 400);

            const content = await contentService.getOne({ url });
            if (!content) throw new AppError('invalid url', 400);

            const success = await this.service.removeSavedContent(req.user, content._id);
            if (!success) throw new AppError("savedContent not found", 400);
            return res.sendStatus(200).end();

        } catch (err) { next(err); }
    }
    async getSavedContents(req, res, next) {
        try {
            let { skip, limit } = req.query;
            skip = Number(skip);
            limit = Number(limit);
            const result = await this.service.getSavedContents(req.user, { skip, limit });
            return res.status(200).json(result).end();

        } catch (err) { console.log(err);next(err); }
    }

    async addBlockedDomain(req, res, next) {
        try {
            const { domain } = req.body;
            if (!domain) throw new MissingBodyFieldError();

            await this.service.addBlockedDomain(req.user, domain);
            return res.sendStatus(200).end();

        } catch (err) { next(err); }
    }
    async setBlockedDomains(req, res, next) {
        try {
            const { domains } = req.body;
            if (!domains) throw new MissingBodyFieldError();

            await this.service.setBlockedDomains(req.user, domains);
            return res.sendStatus(200).end();

        } catch (err) { next(err); }
    }
    async getBlockedDomains(req, res, next) {
        try {
            const blockedDomains = this.service.getBlockedDomains(req.user);
            return res.status(200).json({ blockedDomains }).end();

        } catch (err) { next(err); }
    }
}

module.exports = new UserController(userService);
