const Router = require("express").Router;
const route = Router();
const UserController = require("../../src/controllers/UserController");
const protect = require("../../src/utils/jwt/protect");

route.post("/signup", UserController.signUp);
route.post("/login", UserController.login);
route.post("/logout", protect, UserController.logout);
route.post("/logoutall", protect, UserController.logoutAll);
route.get("/verify", UserController.verifyAccount);
route.post("/resetpassword", UserController.requestResetPassword);
route.put("/password", UserController.updatePassword);
route.put("/", protect, UserController.update).get("/", protect, UserController.getUser).delete("/", protect, UserController.delete);
route.get("/suggestions", protect, UserController.getSuggestions);
route.route("/savedContents").post(protect, UserController.addSavedContent).get(protect, UserController.getSavedContents);
route.delete("/savedContents", protect, UserController.removeSavedContent);
route.route("/blockedDomains")
    .post(protect, UserController.addBlockedDomain)
    .put(protect, UserController.setBlockedDomains)
    .get(protect, UserController.getBlockedDomains);
route.post("/verificationMail", protect, UserController.resendVerificationMail);

module.exports = route;
