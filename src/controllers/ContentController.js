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
      const validContent = [];
      contents.forEach((c) => {
        if (validUrl.isUri(c.longUrl)) validContent.push(c);
      });
      if (validContent.length == 0) return res.status(400).json({ error: "enter valid url" }).end();
      const response = await this.service.insertAll(validContent);
      return res.status(201).send(response).end();
    } catch (e) {
      next(new AppError("something wrong", 400));
    }
  }
}

module.exports = new ContentController(contentService);
