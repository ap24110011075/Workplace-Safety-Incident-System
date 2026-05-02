const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
