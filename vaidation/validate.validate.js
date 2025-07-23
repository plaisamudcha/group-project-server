const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEartly: false });
    next();
  } catch (err) {
    const errMsg = err.errors.map((item) => item);
    const errText = errMsg.join("||");
    const mergeErr = new Error(errText);
    next(mergeErr);
  }
};

export default validate;
