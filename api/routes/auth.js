const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

// Validation
const { registerValidator } = require('../validation');

router.post('/register', async(req, res) => {
  // validate the request 
  const {error} = registerValidator(req.body);  
  if(error) {
    return res.status(400).send({message: error.details[0].message});
  }

  // check if user is already registered
  const emailExist = await User.findOne({email: req.body.email});
  if(emailExist) {
    return res.status(400).send({message: "Email already exists"})
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch(err) {
    res.status(400).send({message: err});
  }
});

router.post('/login', async (req, res) => {
    // check if user is already registered
    const user = await User.findOne({email: req.body.email});
    if(!user) {
      return res.status(400).send({message: "This email is not associated with an account"})
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send({message: "Invalid password"});

    // create the JWT 
    const token = jwt.sign({_id: user._id,}, process.env.jwt_secret);

    res.header('auth-token', token).send(token);
})


module.exports = router;