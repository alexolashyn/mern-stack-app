const express = require('express');
const authRouter = express.Router();

const auth = require('../../middleware/auth');
const User = require('../../models/users');

authRouter.get('/auth-route', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    return res.status(200).json({ user });
  }
  return res.status(400).json({ message: 'User is not found!' });
});

module.exports = authRouter;
