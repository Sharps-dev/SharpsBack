const { AppError } = require("../helpers/AppError");
const Controller = require("./Controller");
const userService = new (require("../services/UserService"))(require("../models/User"));
const contentService = new (require("../services/ContentService"))(require("../models/Content"));
const userHistoryService = new (require("../services/UserHistoryService"))(require("../models/UserHistory"));

class UserHistoryController extends Controller {
    constructor(service) {
        super(service);
    }

    async insert(req, res, next) {
        try {
            const { url, eventType } = req.body;
            if (!eventType) throw new AppError('missing field in body', 400);

            let content;
            if (url) {
                content = await contentService.getOne({ url });
                if (!content) throw new AppError('invalid url', 400);
                content = content._id;
            }
            
            //eventType is checked in mongoose schema enum options
            await this.service.insert({ user: req.user._id, content, eventType/*, extra: { req }*/ });
            return res.sendStatus(201);

        } catch (err) { next(err); }
    }
    async get(req, res, next) {
        try {
            const userHistory = await userService.getHistory(req.user);
            return res.status(200).json({ userHistory }).end();

        } catch (err) { next(err); }
    }
}

module.exports = new UserHistoryController(userHistoryService);
