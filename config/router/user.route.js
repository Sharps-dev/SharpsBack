const Router = require("express").Router;
const route = Router();
const UserController = require("../../src/controllers/UserController");
const protect = require("../../src/utils/jwt/protect");

route.post("/signup", UserController.signUp);
route.post("/login", UserController.login);
route.post("/logout", protect, UserController.logout);
route.post("/logoutall", protect, UserController.logoutAll);
route.put("/", protect, UserController.update);

module.exports = route;
