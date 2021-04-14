const Router = require("express").Router;
const route = Router();
const ContentController = require("../../src/controllers/ContentController");

route.post("/many", ContentController.insertAll);

module.exports = route;
