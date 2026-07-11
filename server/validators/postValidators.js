const { body } = require("express-validator");

const postValidators = [
    body("content")
        .trim()
        .notEmpty().withMessage("Post content is required")
        .bail()
        .isLength({ max: 2000 }).withMessage("Post must be 2000 characters or fewer"),
];

module.exports = { postValidators };
