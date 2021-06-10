const userHistoryService = new (require("./UserHistoryService"))(require("../models/UserHistory"));
const Service = require("./Service");
const validator = require("validator");

class Contentservce extends Service {
  constructor(model) {
    super(model);
    this.search = this.search.bind(this);
  }

  convertUrlQuery(query) {
    if (!query.url.startsWith("https://") && !query.url.startsWith("http://")) query.url = "https://" + query.url;
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
        dislikes: 0,
        clicks: 0
      },
    ];
    return { items: ads, total: 1 };
  }

  async setUserFields(user, contents) {
    const userId = user._id;
    const contentIds = contents.map((c) => c._id);
    const likeHistories = (
      await userHistoryService.getAll(
        {
          user: userId,
          content: { $in: contentIds },
          eventType: "LIKE",
          limit: 0,
        },
        "content"
      )
    ).items;
    const dislikeHistories = (
      await userHistoryService.getAll(
        {
          user: userId,
          content: { $in: contentIds },
          eventType: "DISLIKE",
          limit: 0,
        },
        "content"
      )
    ).items;

    contents = contents.map((content) => {
      const contentId = content._id;
      content = JSON.parse(JSON.stringify(content));
      content.isLiked = likeHistories.some((obj) => obj.content.equals(contentId));
      content.isDisliked = dislikeHistories.some((obj) => obj.content.equals(contentId));
      return content;
    });

    return contents;
  }

  async search(queryString, searchOn, { limit, skip }) {
    const queryArray = searchOn.map((field) => {
      const obj = {};
      obj[field] = { $regex: queryString, $options: "i" };
      return obj;
    });

    if (searchOn.includes("url")) {
      const queryObj = queryArray.find((obj) => obj.url);

      if (validator.isURL(queryString)) {
        const urlObj = { url: queryString };
        this.convertUrlQuery(urlObj); //what if path is empty?
        queryObj.domain = { $regex: urlObj.domain, $options: "i" };
        queryObj.path = { $regex: urlObj.path, $options: "i" };
      } else {
        queryObj.domain = { $regex: queryString, $options: "i" };
        queryArray.push({ path: { $regex: queryString, $options: "i" } });
      }
      delete queryObj.url;
    }

    return await this.getAll({
      limit,
      skip,
      sort: { createdAt: -1 },
      $or: queryArray,
    });
  }
}

module.exports = Contentservce;
