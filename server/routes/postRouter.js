const express = require("express");
const router = express.Router();
const {
    createPostHandler,
    getAllPostsHandler,
    getFeedHandler,
    getPostsByUserHandler,
    getPostByIdHandler,
    updatePostHandler,
    deletePostHandler,
} = require("../controllers/postController");
const { postValidators } = require("../validators/postValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/", ensureAuthenticated, postValidators, handleValidationErrors, createPostHandler);
router.get("/", getAllPostsHandler);
router.get("/feed", ensureAuthenticated, getFeedHandler);
router.get("/user/:userId", getPostsByUserHandler);
router.get("/:id", getPostByIdHandler);
router.patch("/:id", ensureAuthenticated, postValidators, handleValidationErrors, updatePostHandler);
router.delete("/:id", ensureAuthenticated, deletePostHandler);

module.exports = router;
