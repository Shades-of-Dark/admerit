const { prisma } = require("./client");

async function likePost({ postId, userId }) {
    return prisma.like.create({ data: { postId, userId } });
}

async function unlikePost({ postId, userId }) {
    return prisma.like.delete({
        where: { postId_userId: { postId, userId } },
    });
}

async function hasUserLikedPost({ postId, userId }) {
    const like = await prisma.like.findUnique({
        where: { postId_userId: { postId, userId } },
    });
    return Boolean(like);
}

async function getLikesByPost({ postId }) {
    return prisma.like.findMany({
        where: { postId },
        include: { user: { select: { id: true, username: true, profilePhoto: true } } },
    });
}

module.exports = { likePost, unlikePost, hasUserLikedPost, getLikesByPost };
