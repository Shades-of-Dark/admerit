const { followUser, unfollowUser } = require("../prisma/followQueries");

async function followUserHandler(req, res, next) {
    try {
        const followingId = Number(req.params.userId);
        if (followingId === req.user.id) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }

        const follow = await followUser({ followerId: req.user.id, followingId });
        res.status(201).json(follow);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "You're already following this user" });
        }
        if (error.code === "P2003") {
            return res.status(404).json({ error: "User not found" });
        }
        next(error);
    }
}

async function unfollowUserHandler(req, res, next) {
    try {
        const followingId = Number(req.params.userId);
        await unfollowUser({ followerId: req.user.id, followingId });
        res.status(204).end();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "You aren't following this user" });
        }
        next(error);
    }
}

module.exports = { followUserHandler, unfollowUserHandler };
