const Router = require("express").Router;
const route = Router();
const UserController = require("../../src/controllers/UserController");

route.post("/signup", UserController.signUp);
route.post("/login", UserController.login);

module.exports = route;
