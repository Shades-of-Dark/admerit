const express = require("express");
const router = express.Router({ mergeParams: true });
const { followUserHandler, unfollowUserHandler } = require("../controllers/followController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/", ensureAuthenticated, followUserHandler);
router.delete("/", ensureAuthenticated, unfollowUserHandler);

module.exports = router;
