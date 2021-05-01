const mongoose = require("mongoose");
const { AppError } = require("../helpers/AppError");
const Service = require("./Service");
class Contentservce extends Service {
  constructor(model) {
    super(model);

      this.getDefaultSuggestions = this.getDefaultSuggestions.bind(this);
  }

    /**
     * @param {Object} options
     * @param {Number} options.skip
     * @param {Number} options.limit
     */
    async getDefaultSuggestions(options) {
        let skip, limit;
        if (options) {
            skip = options.skip;
            limit = options.limit;
        }
        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;
        return await this.getAll({ skip, limit });
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
