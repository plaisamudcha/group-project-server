const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    // ✅ ตรวจว่ามี .errors และเป็น array
    const errMsg = Array.isArray(err.errors)
      ? err.errors
      : [err.message || "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล"];

    const errText = errMsg.join(" || ");
    const mergeErr = new Error(errText);
    next(mergeErr);
  }
};

export default validate;
