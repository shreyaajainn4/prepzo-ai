const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const passwordController = require("../controllers/password.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


/**
 * @route GET /api/auth/guest
 * @description Sign in as a guest (no account needed)
 * @access Public
 */
authRouter.get("/guest", authController.guestLoginController)


/**
 * @route POST /api/auth/forgot-password/send-otp
 * @description Send OTP to user email for password reset
 * @access Public
 */
authRouter.post("/forgot-password/send-otp", passwordController.sendOtpController)


/**
 * @route POST /api/auth/forgot-password/verify-reset
 * @description Verify OTP and reset password
 * @access Public
 */
authRouter.post("/forgot-password/verify-reset", passwordController.verifyOtpAndResetPasswordController)


module.exports = authRouter