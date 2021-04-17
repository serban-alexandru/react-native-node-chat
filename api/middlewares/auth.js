const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
  const token = req.header('auth-token');
  if(!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const verified = jwt.verify(token, process.env.jwt_secret);
    req.user = User.findById(verified);
    next();

  } catch (err) {
    res.status(400).send({message: "Invalid token"});
  }
}