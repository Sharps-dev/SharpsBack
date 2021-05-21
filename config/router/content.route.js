const Router = require("express").Router;
const route = Router();
const ContentController = require("../../src/controllers/ContentController");

route.post("/many", ContentController.insertAll);
route.put("/suggestions", ContentController.putSuggestions);
route.get("/trend", ContentController.topTrendContents);

module.exports = route;
