const {
   likePost, unlikePost, getLikesByPost, hasUserLikedPost
} = require("../prisma/likeQueries");

async function getLikesHandler(req, res, next) {
    try {
        const postId = Number(req.params.postId);
        const likes = await getLikesByPost({ postId });

    
        const liked = req.user
            ? await hasUserLikedPost({ postId, userId: req.user.id })
            : false;

        res.json({ count: likes.length, liked });
    } catch (error) {
        next(error);
    }
}

async function createLikeHandler(req, res, next) {
    try {
        const postId = Number(req.params.postId);
        const like = await likePost({ postId, userId: req.user.id });
        res.status(201).json(like);
    } catch (error) {
        next(error);
    }
}

async function deleteLikeHandler(req, res, next) {
    try {
        const postId = Number(req.params.postId);
        await unlikePost({ postId, userId: req.user.id });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = { getLikesHandler, createLikeHandler, deleteLikeHandler };