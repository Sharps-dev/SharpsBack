const { AppError } = require("../helpers/AppError");
const Service = require("./Service");
class Contentservce extends Service {
  constructor(model) {
    super(model);
  }
}

module.exports = Contentservce;
