const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const { createUser, loginUser, getUser, userProfile, updateProfile, forgotPassword, sendOtp } = require('../controller/userController');

// Route 1: Create a User using: POST "/api/register". No login required
router.post('/register', [
    body('name', "Name must be at least 3 characters").isLength({ min: 3 }),
    body('email', "Please enter a valid email").isEmail(),
    body('password', "Password must be at least 5 characters").isLength({ min: 5 }),
    body('otp', "OTP is required").isLength({ min: 6, max: 6 }) // Add OTP validation
], createUser);

// Route 2: Authenticate a User using: POST "/api/login". No login required
router.post('/login', [
    body('email', "Please enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()
], loginUser);

// Route 3: Get loggedin User Details using: POST "/api/getuser". Login required
router.get('/getuser', fetchUser, getUser);

// Route 4: Get userProfile User Details using: POST "/api/userProfile". Login required
router.get('/userProfile', fetchUser, userProfile);

// Route 5: Update User Profile using: PUT "/api/updateProfile". Login required
router.put('/updateProfile', fetchUser, [
    body('name', "Name must be at least 3 characters").optional().isLength({ min: 3 }),
    body('email', "Please enter a valid email").optional().isEmail()
], updateProfile);

// Route 6: Forgot Password using: POST "/api/forgotPassword". No login required
router.post('/forgotPassword', [
    body('email', "Please enter a valid email").isEmail()
], forgotPassword);

// Route 7: Send OTP using: POST "/api/send-otp". No login required
router.post('/send-otp', [
    body('email', "Please enter a valid email").isEmail()
], sendOtp);

module.exports = router;
