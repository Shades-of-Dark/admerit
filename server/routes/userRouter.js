// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { createUserPost, getUserByIdHandler, updateUserHandler, getAllUsersHandler } = require("../controllers/userController");
const { signupValidators, updateUserValidators } = require("../validators/userValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const { signupLimiter } = require("../middleware/rateLimiters");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/", signupLimiter, signupValidators, handleValidationErrors, createUserPost);
router.get("/", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.patch("/:id", ensureAuthenticated, updateUserValidators, handleValidationErrors, updateUserHandler);

module.exports = router;