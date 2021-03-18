class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }

    static Handler = function (err, req, res, next) {
        if (err.errors) {
            err.message = err.errors[Object.keys(err.errors)[0]].message;
            err.code = 400;
        } else if (!err.code || err.code >= 600)
            err.code = 503;
        return res.status(err.code).json({ error: err.message }).end();
    }
}
module.exports = AppError;