const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    createCommentPost, getAllCommentsHandler, updateCommentHandler, deleteCommentHandler
} = require("../controllers/commentController");
const { commentValidators } = require("../validators/commentValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/", ensureAuthenticated, commentValidators, handleValidationErrors, createCommentPost);
router.get("/", getAllCommentsHandler);
router.patch("/:commentId", ensureAuthenticated, commentValidators, handleValidationErrors, updateCommentHandler);
router.delete("/:commentId", ensureAuthenticated, deleteCommentHandler);

module.exports = router;