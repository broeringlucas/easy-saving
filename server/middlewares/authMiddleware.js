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

  if (
    req.params.user_id &&
    req.params.user_id.toString() !== decoded.id.toString()
  ) {
    return res.status(403).send({
      message: "Unauthorized access to this resource.",
    });
  }

  req.user = decoded;
  next();
};

module.exports = AuthMiddleware;
