const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Preferences = require('../models/Preferences');
const { authMiddleware } = require('../middlewares/authMiddleware');

// route to update preferences
router.put('/updatePreferences', authMiddleware, async (req, res) => {

  const { guestSize, venues } = req.body; 
  const userId = req.userId;

  try {
    
    const updateFields = {};
    
    if (guestSize) updateFields.guestSize = guestSize;
    if (venues) updateFields.venues = venues;

    // Check if any update fields are provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Use $set to update only the provided fields
    const updatedPreferences = await Preferences.findOneAndUpdate(
      { userId },           // Find preferences by userId
      { $set: updateFields }, // Set only the updated fields
      { new: true }          // Return the updated document
    );

    if (!updatedPreferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    res.status(200).json({ message: 'Preferences updated successfully', updatedPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;