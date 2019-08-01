const { User, SecurityKey } = require("../db");

const EXCLUDED_PATHS = [
  "/",
  "/api/users",
  "/api/auth/login",
  "/api/auth/assertion"
];

module.exports = async (req, res, next) => {
  if (EXCLUDED_PATHS.includes(req.path)) {
    return next();
  }

  try {
    const token = req.cookies["auth"];
    if (token === undefined) {
      throw new Error("Authorization token missing.");
    }
    const decoded = User.verifyJwt(token);
    const user = await User.findById(decoded.context.user.id, {
      include: [SecurityKey]
    });

    if (user === null) {
      throw new Error("User related to token not found");
    }

    req.user = user;
    return next();
  } catch (e) {
    return res
      .clearCookie("auth")
      .status(401)
      .send({ message: e.message });
  }
};
