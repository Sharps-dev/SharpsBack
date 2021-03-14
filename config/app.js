const express  = require('express');
const bodyParser = require('body-parser');
const setRoutes = require('./routes');
const databaseConnect = require('./database');

const initiateApp = async () => {

    const app = express();
    setRoutes(app);
    databaseConnect();

    app.use(bodyParser.json());

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