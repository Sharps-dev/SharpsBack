const userRoute = require("./router/user.route");
const contentRoute = require("./router/content.route");
module.exports = (app) => {
  app.get("/test", (req, res) => {
    res.status(200).json("Hello world");
  });

  // USER ROUTES
  app.use("/user", userRoute);
  //app.put(`/user/:id`, UserController.update);
  //app.delete(`/user/:id`, UserController.delete);

  app.use("/content", contentRoute);
};
