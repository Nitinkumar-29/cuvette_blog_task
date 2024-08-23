const jwt = require("jsonwebtoken");
const jwt_secret = "cuvette_task@2905";

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json("unauthorized access");
  }

  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json("internal server error");
  }
};

module.exports = fetchUser;
