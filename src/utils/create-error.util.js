const createError = (statusCode, msg) => {
  const errObj = new Error(msg);
  errObj.statusCode = statusCode;
  throw errObj;
};

export default createError;
