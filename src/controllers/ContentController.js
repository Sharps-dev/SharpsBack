const Controller = require("./Controller");
const ContentService = require("../services/ContentService");
const Content = require("../models/Content");
const { AppError } = require("../helpers/AppError");
const validUrl = require("valid-url");
const contentService = new ContentService(Content);

class ContentController extends Controller {
  constructor(service) {
    super(service);
    this.insertAll = this.insertAll.bind(this);
  }

  async insertAll(req, res, next) {
    try {
      const contents = req.body;
      const response = await this.service.insertAll(contents);
      return res.status(201).send(response).end();
    } catch (e) {
      next(new AppError("something wrong", 400));
    }
  }
}

module.exports = new ContentController(contentService);
