const { body } = require("express-validator");

const commentValidators = [
    body("content")
        .trim()
        .notEmpty().withMessage("Comment cannot be empty")
        .bail()
        .isLength({ max: 500 }).withMessage("Comment must be 500 characters or fewer"),
];

module.exports = { commentValidators };