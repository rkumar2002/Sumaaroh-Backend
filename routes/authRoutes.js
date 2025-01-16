const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User'); 
const Preferences = require('../models/Preferences');

const router = express.Router();

// Sign up or Log in route
router.post(
  '/login',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body; 

    try {
      // Check if email already exists in the database
      let user = await User.findOne({ email });

      if (user) {
        // If email is found, check if the name matches
        if (user.name !== name) {
          return res.status(400).json({ message: 'Name does not match the registered name' });
        }

        // If name matches, check the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        return res.status(200).json({ message: 'Login', token, username: name });
      } else {
        // If email is not found, create a new user
        user = new User({
          name,
          email,
          password: await bcrypt.hash(password, 10)
        });

        await user.save();

        // Create a new preferences document with the userId
        const preferences = new Preferences({ userId: user._id });
        await preferences.save();

        // Generate JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        return res.status(201).json({ message: 'Sign up', token, username: name });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;