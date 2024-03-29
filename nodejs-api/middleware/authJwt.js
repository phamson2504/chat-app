const jwt = require("jsonwebtoken");

module.exports.authJwt = (req, res, next) => {
    const token = req.headers.authorization || req.body.headers.authorization ;
    if (!token) {
        return res.json({ msg: "No token provided!", auth: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ msg: 'Token verification failed', auth: false });
        }
        req.userId = decoded.userId;
        next();
    });
}