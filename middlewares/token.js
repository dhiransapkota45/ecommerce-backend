const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("authToken");
    if (!token) {
      return res
        .status(400)
        .json({ msg: "Couldnot find token", success: false });
    }
    const payload_data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT);
    req.user = payload_data.user;
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, msg: error.message });
  }
};

module.exports = fetchuser;
