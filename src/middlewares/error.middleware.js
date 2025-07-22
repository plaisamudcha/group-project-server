const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json({ error: err.message || "Internal server error" });
};

export default errorMiddleware;
