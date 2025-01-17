const express = require('express');
const router = express.Router();
const Preferences = require('../models/Preferences');
const User = require('../models/User');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET request to fetch guestSize preference of the user
router.get('/guestSize', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const preferences = await Preferences.findOne({ userId });
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found for the user' });
    }
    
    res.status(200).json({ guestSize: preferences.guestSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET request to fetch venues preference of the user
router.get('/venues', authMiddleware, async (req, res) => {
  const userId = req.userId; 

  try {
    const preferences = await Preferences.findOne({ userId });
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found for the user' });
    }

    res.status(200).json({ venues: preferences.venues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET request to fetch guestSize and venues preference of the user
router.get('/preferences', authMiddleware, async (req, res) => {
  const userId = req.userId; 

  try {
    const preferences = await Preferences.findOne({ userId });
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found for the user' });
    }

    res.status(200).json({ venues: preferences.venues, guestSize: preferences.guestSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  GET request to fetch name and email of the user
router.get('/user-details', authMiddleware, async (req, res) => {
  const userId = req.userId; 
  
  try {
    const user = await User.findById(userId).select('name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST request to update guestSize preference of the user
router.post('/updateGuestSize', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { guestSize } = req.body;

  try {
    const preferences = await Preferences.findOneAndUpdate(
      { userId },
      { guestSize },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: 'Guest size updated successfully', guestSize: preferences.guestSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST request to update venues preference of the user
router.post('/updateVenues', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { venues } = req.body;

  try {
    const preferences = await Preferences.findOneAndUpdate(
      { userId },
      { venues },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: 'Venues updated successfully', venues: preferences.venues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;