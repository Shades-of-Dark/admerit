// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { createUserPost, getUserByIdHandler, updateUserHandler, getAllUsersHandler } = require("../controllers/userController");
const { signupValidators } = require("../validators/userValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const { signupLimiter } = require("../middleware/rateLimiters");

router.post("/", signupLimiter, signupValidators, handleValidationErrors, createUserPost);
router.get("/", getAllUsersHandler); 
router.get("/:id", getUserByIdHandler); 
router.patch("/:id", updateUserHandler);

module.exports = router;