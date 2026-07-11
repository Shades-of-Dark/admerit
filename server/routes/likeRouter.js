const express = require("express");
const {createLikeHandler, deleteLikeHandler, getLikesHandler} = require("../controllers/likeController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated"); 

const router = express.Router({ mergeParams: true });


router.post("/", ensureAuthenticated, createLikeHandler);
router.delete("/", ensureAuthenticated, deleteLikeHandler);
router.get("/", getLikesHandler); 

module.exports = router;
