const express = require('express');
const profileRouter = express.Router();

const Profile = require('../../models/profiles');
const User = require('../../models/users');

const auth = require('../../middleware/auth');
const profileValidation = require('../../middleware/validation/profiles');

profileRouter.get('/me', auth, async (req, res) => {
  try {
    const { id } = req.user;
    const profile = await Profile.findOne({ user: id }).populate('user', [
      'username',
    ]);
    if (!profile) {
      return res
        .status(404)
        .json({ message: 'There is no profile for this user' });
    }
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

profileRouter.post('/add', auth, async (req, res) => {
  try {
    const { id } = req.user;
    const ifProfileExists = await Profile.findOne({ user: id });
    if (ifProfileExists) {
      return res.status(400).json({
        message: 'You cannot create a new account until you already have one!',
      });
    }
    const profileData = req.body;
    await profileValidation.validateAsync(profileData);
    const profile = await Profile.create({ user: id, ...profileData });
    return res.status(200).json({ profile });
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: error.details[0].message });
    }
    return res.status(500).json({ message: error });
  }
});

profileRouter.put('/update', auth, async (req, res) => {
  try {
    const newProfileData = req.body;
    await profileValidation.validateAsync(newProfileData);

    const fieldsToDelete = {};
    Object.keys(newProfileData).forEach((key) => {
      if (!newProfileData[key]) {
        fieldsToDelete[key] = 1;
        delete newProfileData[key];
      }
    });

    const { id } = req.user;
    const profile = await Profile.findOneAndUpdate(
      { user: id },
      { $set: newProfileData, $unset: fieldsToDelete },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({
        message: 'You do not have profile to edit!',
      });
    }
    return res.status(200).json({ profile });
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: error.details[0].message });
    }
    return res.status(500).json({ message: error });
  }
}); // add routse to update education and social networks

profileRouter.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['username']);
    res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

profileRouter.get('/:user_id', async (req, res) => {
  try {
    const profile = await Profile.find({ user: req.params.user_id });
    if (profile) {
      return res.status(200).json({ profile });
    }
    return res.status(404).json({ message: "User's profile is not found!" });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "User's profile is not found!" });
    }
    return res.status(500).json({ message: error });
  }
});

profileRouter.delete('/delete', auth, async (req, res) => {
  try {
    const { id } = req.user;
    const profile = await Profile.findOneAndDelete({ user: id });
    const user = await User.findByIdAndDelete(id);
    if (!user || !profile) {
      return res.status(404).json({ message: 'Your data was not deleted!' });
    }
    return res
      .status(200)
      .json({ message: 'Your data was successfully deleted!' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = profileRouter;
