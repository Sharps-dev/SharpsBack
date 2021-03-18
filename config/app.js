const express  = require('express');
const bodyParser = require('body-parser');
const setRoutes = require('./routes');
const databaseConnect = require('./database');
const swaggerUi = require("swagger-ui-express");
const swaggerParser = require('swagger-parser');
const path = require('path');
const AppError = require('../src/helpers/AppError');

const initiateApp = async () => {

    const app = express();
    app.use(bodyParser.json());

    setRoutes(app);
    databaseConnect();
    const swagger_path = path.resolve(__dirname, './swagger.yaml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(await swaggerParser.bundle(swagger_path), { explorer: true }));

    app.use(AppError.Handler);

    return app
}
module.exports = initiateApp;