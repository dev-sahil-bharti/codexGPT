const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Create a User using: POST "/api/createuser". No login required
const createUser = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        // Check if user already exists
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

        // Logic to send reset password email would go here
        // For now, we'll just return a success message
        return res.status(200).json({ message: "Password reset link has been sent to your email" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { createUser, loginUser, getUser, userProfile, updateProfile, forgotPassword };
