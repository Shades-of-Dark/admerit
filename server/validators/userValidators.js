const { body } = require("express-validator");
const { findUserByUsername, findUserByEmail } = require("../prisma/userQueries");

const USERNAME_MESSAGE = "Username must be 3-20 characters and contain only letters, numbers, and underscores";
const PASSWORD_MESSAGE = "Password must be 8-72 characters";
const EMAIL_MESSAGE = "Enter a valid email address";

const signupValidators = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .bail()
        .isLength({ min: 3, max: 20 }).withMessage(USERNAME_MESSAGE)
        .bail()
        .matches(/^[a-zA-Z0-9_]+$/).withMessage(USERNAME_MESSAGE)
        .bail()
        .custom(async (value) => {
            const existing = await findUserByUsername({ username: value });
            if (existing) throw new Error("Username is already taken");
        }),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .bail()
        .isEmail().withMessage(EMAIL_MESSAGE)
        .bail()
        .normalizeEmail()
        .custom(async (value) => {
            const existing = await findUserByEmail({ email: value });
            if (existing) throw new Error("An account with this email already exists");
        }),

    body("password")
        .notEmpty().withMessage("Password is required")
        .bail()
        .isLength({ min: 8, max: 72 }).withMessage(PASSWORD_MESSAGE),

    body("bio")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 280 }).withMessage("Bio must be 280 characters or fewer"),

    body("intendedMajor")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 }).withMessage("Intended major must be 100 characters or fewer"),

    body("profilePhoto")
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage("Profile photo must be a valid URL"),
];

const loginValidators = [
    body("username").trim().notEmpty().withMessage("Username or email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { signupValidators, loginValidators, PASSWORD_MESSAGE };
