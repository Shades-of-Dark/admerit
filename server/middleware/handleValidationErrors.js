const { validationResult } = require("express-validator");

function handleValidationErrors(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = {};
    for (const err of result.array()) {
        if (!errors[err.path]) errors[err.path] = err.msg;
    }
    res.status(400).json({ errors });
}

module.exports = handleValidationErrors;
