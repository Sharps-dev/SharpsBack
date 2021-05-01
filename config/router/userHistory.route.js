const Router = require("express").Router;
const route = Router();
const UserHistoryController = require("../../src/controllers/UserHistoryController");
const protect = require("../../src/utils/jwt/protect");

route.route("/")
    .post(protect, UserHistoryController.insert)
    .get(protect, UserHistoryController.get);

module.exports = route;
