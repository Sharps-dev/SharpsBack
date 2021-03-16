const express  = require('express');
const bodyParser = require('body-parser');
const setRoutes = require('./routes');
const databaseConnect = require('./database');
const swaggerUi = require("swagger-ui-express");
const swaggerParser = require('swagger-parser');
const path = require('path');

const initiateApp = async () => {

    const app = express();
    app.use(bodyParser.json());

    setRoutes(app);
    databaseConnect();
    const swagger_path = path.resolve(__dirname, './swagger.yaml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(await swaggerParser.bundle(swagger_path), { explorer: true }));

    //error middleware
    app.use(function (err, req, res, next) {
        if (err.errors) {
            err.message = err.errors[Object.keys(err.errors)[0]].message;
            err.code = 400;
        } else if (!err.code || err.code >= 600)
            err.code = 503;
        res.status(err.code).json({ error: err.message });
    });

    return app
}
module.exports = initiateApp;