const express = require("express");
const setRoutes = require("./routes");
const databaseConnect = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerParser = require("swagger-parser");
const path = require("path");
const cors = require("cors");
const { handleError } = require("../src/helpers/AppError");

const initiateApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  setRoutes(app);
  databaseConnect();
  const swagger_path = path.resolve(__dirname, "./swagger.yaml");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(await swaggerParser.bundle(swagger_path), { explorer: true }));

  app.use((err, req, res, next) => {
    handleError(err, res);
  });

  return app;
};
module.exports = initiateApp;
