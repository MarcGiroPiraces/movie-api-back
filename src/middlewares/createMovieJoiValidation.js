const schemaMovieJoi = require("../server/schemas/schemaMovieJoi");

const createMovieJoiValidation = (req, res, next) => {
  const { error: validationError } = schemaMovieJoi.validate(req.body);
  if (validationError) {
    const error = new Error(validationError.details[0].message);
    error.status = 401;
    return next(error);
  }
  return next();
};

module.exports = createMovieJoiValidation;
