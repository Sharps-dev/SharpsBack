const express = require("express");
const setRoutes = require("./routes");
const databaseConnect = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerParser = require("swagger-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { handleError } = require("../src/helpers/AppError");
const morgan = require("morgan");

const initiateApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  if (process.env.NODE_ENV == "dev") app.use(morgan("dev"));
  else {
    let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
    app.use(morgan("combined", { stream: accessLogStream }));
  }
  setRoutes(app);
  databaseConnect();
  require("../src/helpers/Mailer");
  const swagger_path = path.resolve(__dirname, "./swagger.yaml");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(await swaggerParser.bundle(swagger_path), { explorer: true }));

  app.use((err, req, res, next) => {
    handleError(err, res);
  });

  return app;
};
module.exports = initiateApp;
