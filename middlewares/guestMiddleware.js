function guestMiddleware(req, res, next) {
	if (req.session.userLogged) {
		return res.redirect('/json/profile');
	}
	next();
}

module.exports = guestMiddleware;