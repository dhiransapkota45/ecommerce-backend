const jwt = require("jsonwebtoken");

const verifyRefresh = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRECT);
    // console.log(decoded);
    return decoded;
  } catch (error) {
    return false;
  }
};

module.exports = verifyRefresh;
