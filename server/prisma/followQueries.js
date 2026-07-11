const { prisma } = require("./client");

const USER_SELECT = { id: true, username: true, profilePhoto: true };

async function followUser({ followerId, followingId }) {
    return prisma.follow.create({ data: { followerId, followingId } });
}

async function unfollowUser({ followerId, followingId }) {
    return prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
    });
}

async function isFollowing({ followerId, followingId }) {
    const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
    });
    return Boolean(follow);
}

async function getFollowers({ userId }) {
    return prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: { select: USER_SELECT } },
    });
}

async function getFollowing({ userId }) {
    return prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: { select: USER_SELECT } },
    });
}

module.exports = { followUser, unfollowUser, isFollowing, getFollowers, getFollowing };
