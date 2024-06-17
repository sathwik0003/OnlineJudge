const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./database/db')
const User = require('./models/Users')
const Referral = require('./models/Referrals')

dotenv.config({
    path: './.env'
});

const app = express();
const port = 2999;

// Connect to the database
connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome");
});

// Regex patterns for validation
const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number

app.post("/register/:referralCode?", async (req, res) => {
    const { username, password, confirmPassword, email, fullName } = req.body;
    const { referralCode } = req.params;

    try {
        // Input validation
        if (!usernameRegex.test(username)) {
            return res.status(400).send("Invalid username. Must be 3-30 characters long, containing only letters and numbers.");
        }

        if (!emailRegex.test(email)) {
            return res.status(400).send("Invalid email format.");
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send("Password must be at least 8 characters long and contain at least one letter and one number.");
        }

        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send("Username or email already exists.");
        }

        let referralBy = null;
        let coins = 0;

        if (referralCode) {
            // Check if the referral code is valid
            const existingReferral = await Referral.findOne({ referralCode });

            if (!existingReferral) {
                return res.status(400).send("Invalid referral code");
            }

            // If valid, set the referralBy to the referrer's userId
            referralBy = existingReferral.userId;

            // Increment the referral count for the referrer
            existingReferral.referralCount += 1;
            await existingReferral.save();

            // Award 30 coins for successful referral
            coins = 30;

            // Increment coins for the referrer
            const referrer = await User.findById(existingReferral.userId);
            if (referrer) {
                referrer.coins += coins;
                await referrer.save();
            }
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = new User({
            username,
            password: hashedPassword,
            email,
            fullName,
            coins,
            joined: new Date(),
            lastUpdate: new Date()
        });

        await user.save();

        // Create a referral for the new user
        const newReferral = new Referral({
            userId: user._id,
            referralCode: generateReferralCode(),
            referralBy,
            referralCount: 0
        });

        await newReferral.save();

        // Generate JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Generate a unique referral code (simple implementation)
function generateReferralCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
