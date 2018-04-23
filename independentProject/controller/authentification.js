var session = require('express-session');
var User = require('../models/user');

authAdmin = function (req, res, next) {
    if (req.session && req.session.user === "admin") {
        return next();
    }
    else {
        return res.sendStatus(401);
    }
};
authUsers = function (req, res, next) {
    if (req.session && req.session.user) {

        return next();
    } else {
        return res.sendStatus(401);
    }
}
module.exports = {
    authAdmin,
    authUsers
}