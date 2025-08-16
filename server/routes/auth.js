const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// @route   POST api/auth/register
// @desc    Register student
// @access  Public
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('college.name', 'College name is required').not().isEmpty(),
  check('college.tier', 'College tier is required').isIn(['Tier-1', 'Tier-2', 'Tier-3']),
  check('branch', 'Branch is required').not().isEmpty(),
  check('admissionYear', 'Admission year is required').isNumeric(),
  check('currentYear', 'Current year is required').isNumeric(),
  check('currentSemester', 'Current semester is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    password,
    phone,
    college,
    branch,
    admissionYear,
    currentYear,
    currentSemester,
    twelfthPercentage,
    jeeScore,
    cetScore
  } = req.body;

  try {
    // Check if student already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Create new student
    student = new Student({
      name,
      email,
      password,
      phone,
      college,
      branch,
      admissionYear,
      currentYear,
      currentSemester,
      twelfthPercentage,
      jeeScore,
      cetScore
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);

    // Set profile completion
    student.profileCompletion.basicInfo = true;
    student.profileCompletion.academicInfo = true;

    await student.save();

    // Create JWT token
    const payload = {
      user: {
        id: student.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if student exists
    let student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: student.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current student profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update student profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields
    const updateFields = req.body;
    Object.keys(updateFields).forEach(key => {
      if (key !== 'password' && key !== 'email') {
        student[key] = updateFields[key];
      }
    });

    await student.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/interest-quiz
// @desc    Submit interest quiz results
// @access  Private
router.post('/interest-quiz', auth, async (req, res) => {
  try {
    const { interests, careerGoals } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.interests = interests;
    student.careerGoals = careerGoals;
    student.profileCompletion.interestQuiz = true;

    await student.save();
    res.json({ message: 'Interest quiz completed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
