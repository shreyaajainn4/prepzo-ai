const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const isProduction = process.env.NODE_ENV === "production"

const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        // Check if user already exists with same email OR username
        const existingByEmail = await userModel.findOne({ email: email.toLowerCase().trim() })
        if (existingByEmail) {
            return res.status(400).json({
                message: "An account already exists with this email address"
            })
        }

        const existingByUsername = await userModel.findOne({ username: username.trim() })
        if (existingByUsername) {
            return res.status(400).json({
                message: "This username is already taken. Please choose another."
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hash
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, cookieOptions)

        res.status(201).json({
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        console.log("Register error:", error)

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]
            const message = field === "email"
                ? "An account already exists with this email address"
                : "This username is already taken. Please choose another."
            return res.status(400).json({ message })
        }

        res.status(500).json({
            message: "Registration failed. Please try again."
        })
    }
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const user = await userModel.findOne({ email: email.toLowerCase().trim() })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        console.log("Login error:", error)
        res.status(500).json({
            message: "Login failed. Please try again."
        })
    }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
            || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null)

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token")

        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("Logout error:", error)
        res.status(500).json({ message: "Logout failed" })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.log("GetMe error:", error)
        res.status(500).json({ message: "Failed to get user details" })
    }
}



/**
 * @name guestLoginController
 * @description Issue a guest JWT — no DB record created
 * @access Public
 */
async function guestLoginController(req, res) {
    try {
        const token = jwt.sign(
            { id: 'guest', username: 'Guest', isGuest: true },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: 2 * 60 * 60 * 1000 // 2 hours
        })

        res.status(200).json({
            message: 'Signed in as guest',
            token,
            user: { id: 'guest', username: 'Guest', isGuest: true }
        })
    } catch (error) {
        console.log('Guest login error:', error)
        res.status(500).json({ message: 'Failed to sign in as guest' })
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    guestLoginController
}