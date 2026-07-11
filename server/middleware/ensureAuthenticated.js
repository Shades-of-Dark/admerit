function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    res.status(401).json({ error: "You must be logged in to do that" });
}

module.exports = ensureAuthenticated;
