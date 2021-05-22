﻿const mongoose = require("mongoose");
const { AppError } = require("../helpers/AppError");
const Service = require("./Service");
class Contentservce extends Service {
  constructor(model) {
    super(model);
  }

  convertUrlQuery(query) {
    if (!query.url.startsWith("https://")) query.url = "https://" + query.url;
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

  async getAds() {
    const ads = [
      {
        url: "sharpsback.herokuapp.com/api-docs",
        title: "100% WHITE HAIR CURE 😱",
        des: "Did you know that human hair is actually white Mr. Zia?",
        image: "https://i.ibb.co/SvcwZ6s/8zs9-L1vl-400x400.jpg",
        isAd: true,
        likes: 0,
        clicks: 0,
      },
    ];
    return { items: ads, total: 1 };
  }
}

module.exports = Contentservce;
