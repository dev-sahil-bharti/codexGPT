const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const Otp = require('../model/Otp'); // Import Otp model
const nodemailer = require('nodemailer'); // Import nodemailer

const JWT_SECRET = process.env.JWT_SECRET;

// Configure Nodemailer Transporter
// NOTE: Use environment variables for real credentials in production
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your app password
    }
});

// Send OTP Route: POST "/api/send-otp"
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB (upsert to handle re-sends)
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code - CodexGPT',
            text: `Your verification code is: ${otp}. It expires in 5 minutes.`
        };

        // If email creds are not set, just log it (for development)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
            return res.status(200).json({
                success: true,
                message: "OTP generated (Dev Mode: Check console)",
                devMode: true
            });
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (err) {
        console.error("Send OTP Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Create a User using: POST "/api/createuser". No login required
const createUser = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, otp } = req.body;

        // Verify OTP
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Check if user already exists (double check)
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash password before saving (secure)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Delete used OTP
        await Otp.deleteOne({ email });

        // Prepare payload for JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign JWT (valid for 1 hour)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Return user info + JWT
        return res.status(201).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Authenticate a User using: POST "/api/login". No login required
const loginUser = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            name: user.name,
            token
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get loggedin User Details using: POST "/api/auth/getuser". Login required
const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const userProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = {};

        if (name) { newUser.name = name; }
        if (email) { newUser.email = email; }

        // Find the user to be updated and update it
        let user = await User.findById(req.user.id);
        if (!user) { return res.status(404).send("Not Found") }

        user = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true }).select("-password");
        res.json(user);

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generator logic/token for real reset would be here
        // For now, logging to console if dev
        if (!process.env.EMAIL_USER) {
            console.log(`[DEV] Password reset requested for ${email}`);
        }

        // Logic to send reset password email would go here

        return res.status(200).json({ message: "Password reset link has been sent to your email" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// Change Password Route: PUT "/api/auth/changepassword"
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordCompare = await bcrypt.compare(currentPassword, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password changes successfully" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createUser, loginUser, getUser, userProfile, updateProfile, forgotPassword, sendOtp, changePassword };
