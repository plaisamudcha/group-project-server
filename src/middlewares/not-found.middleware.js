const notFoundMiddleware = (req, res) => {
  res.status(404).json({ message: "Path not found!!!" });
};

export default notFoundMiddleware;
