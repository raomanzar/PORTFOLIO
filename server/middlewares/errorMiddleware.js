class ErrorHandler extends Error {
  constructor(statusCode, errorName, errorMessage) {
    super(errorMessage);
    this.status = statusCode;
    this.name = errorName;
    this.message = errorMessage;
  }
}

export { ErrorHandler };

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const name = err.name || "Error";

  return res.status(status).json({ status, name, message });
};

export default errorMiddleware;
