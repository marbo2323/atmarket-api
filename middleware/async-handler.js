/* 
  Handler function to wrap each route.
  This function is from the Teamtreehose.com REST API Authentication with Express course.
  https://teamtreehouse.com/library/rest-api-authentication-with-express-2
*/
exports.asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
};
