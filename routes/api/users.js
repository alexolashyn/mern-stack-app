const express = require('express');
const userRouter = express.Router();

const userValidation = require('../../middleware/validation/users');
const User = require('../../models/users');

userRouter.post('/sign-up', async (req, res) => {
  try {
    const userData = req.body;

    if (await User.findOne({ email: userData.email })) {
      return res
        .status(400)
        .json({ message: 'Provided email already exists!' });
    }

    await userValidation.validateAsync(userData);
    const user = await User.create(userData);
    const token = user.createJWT();
    return res.status(200).json({ token });
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: error.details[0].message });
    }
    return res.status(500).json({ message: error });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Login data is not provided!' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }
    const token = user.createJWT();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = userRouter;
