const express = require("express");
const setRoutes = require("./routes");
const databaseConnect = require("./database");
const AppError = require("../src/helpers/AppError");
const app = express();
databaseConnect();
app.use(express.json());
setRoutes(app);
app.use(AppError.Handler);

module.exports = app;
