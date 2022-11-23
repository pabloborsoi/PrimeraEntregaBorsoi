function adminMiddleware(req, res, next) {
  console.log(req.session)
    if (req.session.userLogged.isadmin !=1){
      return res.redirect("/json")
    }
    next();
  }
  module.exports = adminMiddleware;