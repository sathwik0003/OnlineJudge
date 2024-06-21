const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./database/db');
const User = require('./models/Users');
const Referral = require('./models/Referrals');

dotenv.config({
    path: './.env'
});

const app = express();
const port = 2999;

// Connect to the database
connectDB();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.get("/", (req, res) => {
    res.send("Welcome");
});

// Regex patterns for validation
const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number

app.post("/register/:referralCode?", async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    const { referralCode } = req.params;

    try {
        if (!(username && password && email && firstName && lastName)) {
            return res.status(400).send("Please fill all the fields");
        }
        if (!usernameRegex.test(username)) {
            return res.status(400).send("Invalid username. Must be 3-30 characters long, containing only letters and numbers.");
        }

        if (!emailRegex.test(email)) {
            return res.status(400).send("Invalid email format.");
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send("Password must be at least 8 characters long and contain at least one letter and one number.");
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
            firstName,
            lastName,
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

        res.status(201).json({ token: token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Generate a unique referral code (simple implementation)
function generateReferralCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!(username && password)) {
            return res.status(400).send("Please fill all the fields");
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("Invalid username or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid username or password");
        }

        // Generate JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({ token: token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Check if username exists
app.post('/check-username', async (req, res) => {
    const { username } = req.body;
    try {
      const user = await User.findOne({ username });
      res.json({ exists: !!user });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while checking the username' });
    }
  });
  
  // Check if email exists
  app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      res.json({ exists: !!user });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while checking the email' });
    }
  });

// Middleware to authenticate user using JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

// Update profile endpoint
app.post("/updateprofile", authenticateToken, async (req, res) => {
    const { username, firstName,lastName, email } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.firstName = firstName;
        }

        if (username) {
            if (!usernameRegex.test(username)) {
                return res.status(400).send("Invalid username format.");
            }

            // Check if email already exists
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).send("username already in use.");
            }

            user.username = username;
             // Generate a new JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

             // Store the new token in a cookie
            res.cookie('token', token, { httpOnly: true });

        }
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(400).send("Invalid email format.");
            }

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).send("Email already in use.");
            }

            user.email = email;
        }

        user.lastUpdate = new Date();
        await user.save();

        res.status(200).send("Profile updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Change password endpoint
app.post("/changepassword", authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    try {
        if (!(currentPassword && newPassword)) {
            return res.status(400).send("Please fill all the fields");
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send("Password must be at least 8 characters long and contain at least one letter and one number.");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.lastUpdate = new Date();

        await user.save();

        // Generate a new JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the new token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(200).send("Password changed successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
