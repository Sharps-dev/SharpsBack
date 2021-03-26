class AppError extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode || 400;
    this.message = message || "somthing wrong";
  }
}

// function for get error and show it
const handleError = (err, res) => {
  const { statusCode, message } = err;
  return res
    .status(statusCode || 400)
    .json({
      error: true,
      message,
    })
    .end();
};
module.exports = { AppError, handleError };
