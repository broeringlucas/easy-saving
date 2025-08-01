const jwtHelper = require("../utils/jwtHelper");

const AuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .send({ message: "Unauthorized - No token provided" });
  }

  const decoded = jwtHelper.verifyToken(token);
  req.userId = decoded.id;
  if (!decoded) {
    return res.status(403).send({ message: "Forbidden - Invalid token" });
  }

  req.user = decoded;
  next();
};

module.exports = AuthMiddleware;
