function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.json({ status: "unauthorized" });
}


exports.checkAuthenticated = checkAuthenticated;