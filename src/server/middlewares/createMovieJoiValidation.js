const schemaMovieJoi = require("../schemas/schemaMovieJoi");

const createMovieJoiValidation = (req, res, next) => {
  const { error: validationError } = schemaMovieJoi.validate(req.body);

  if (validationError) {
    const error = new Error("Validation joi");
    error.code = 401;
    return next(error);
  }
  return next();
};

module.exports = createMovieJoiValidation;
