const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(401)
        .json({ errors: "token not exist Accès non autorisé " });
    }
    const token = authorization.split(" ")[1];
    try {
      const { id } = jwt.verify(token, process.env.SECRET);
      // req.user = await User.findById(id).select("_id")
      // next()
      const decode = jwt.verify(token, process.env.SECRET);
      req.user = decode;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Accès interdit pour ce rôle" });
      }
      // req.user = {decode}
      next();
    } catch (error) {
      res.status(401).json({ eror: "invalid token" });
    }
  };
};

module.exports = auth;
