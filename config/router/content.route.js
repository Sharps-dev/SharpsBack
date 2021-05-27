const Router = require("express").Router;
const route = Router();
const ContentController = require("../../src/controllers/ContentController");
const protect = require("../../src/utils/jwt/protect");

route.post("/many", ContentController.insertAll);
route.put("/suggestions", ContentController.putSuggestions);
route.get("/trend", ContentController.topTrendContents);
route.get("/search", protect, ContentController.search);

module.exports = route;
