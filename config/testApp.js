const express = require("express");
const setRoutes = require("./routes");
const databaseConnect = require("./database");
const { handleError } = require("../src/helpers/AppError");
const app = express();
databaseConnect();
app.use(express.json());
setRoutes(app);
app.use((err, req, res, next) => {
  handleError(err, res);
});
module.exports = app;
