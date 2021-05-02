const mongoose = require("mongoose");
const { AppError } = require("../helpers/AppError");
const Service = require("./Service");
class Contentservce extends Service {
  constructor(model) {
    super(model);
  }

    convertUrlQuery(query) {
        if (!query.url.startsWith('https://')) query.url = 'https://' + query.url;
        const url = new URL(query.url);
        query.domain = url.hostname;
        query.path = url.pathname;
        delete query.url;
    }

    async getAll(query) {
        if (query.url) this.convertUrlQuery(query);
        return super.getAll(query);
    }
    async getOne(query) {
        if (query.url) this.convertUrlQuery(query);
        return super.getOne(query);
    }
}

module.exports = Contentservce;
