class AppError extends Error {
    constructor(message, statusCode) {
        super();
        this.statusCode = statusCode || 400;
        this.message = message || "An unexpected error occurred";
    }
}

const handleError = (err, res) => {

    if (err.errors) {
        err.message = err.errors[Object.keys(err.errors)[0]].message;
        err.statusCode = 400;
    } else if (!err.statusCode || err.statusCode >= 600)
        err.statusCode = 503;

    return res
        .status(err.statusCode)
        .json({ error: err.message })
        .end();
};
module.exports = { AppError, handleError };
