const Controller = require("./Controller");
const ContentService = require("../services/ContentService");
const Content = require("../models/Content");
const { AppError } = require("../helpers/AppError");

const contentService = new ContentService(Content);

class ContentController extends Controller {
  constructor(service) {
    super(service);
  }
}

module.exports = new ContentController(contentService);
