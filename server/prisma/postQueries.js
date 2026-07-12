const { prisma } = require("./client");

const AUTHOR_SELECT = { id: true, username: true, profilePhoto: true };
const POST_INCLUDE = {
    author: { select: AUTHOR_SELECT },
    _count: { select: { comments: true, likes: true } },
};

async function createPost({ content, authorId }) {
    return prisma.post.create({
        data: { content, authorId },
        include: POST_INCLUDE,
    });
}

async function getAllPosts({ page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return prisma.post.findMany({
        include: POST_INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
}

async function getFeedPosts({ userId, page = 1, limit = 20 } = {}) {
    const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });
    const authorIds = [userId, ...follows.map((f) => f.followingId)];

    const personalized = await prisma.post.findMany({
        where: { authorId: { in: authorIds } },
        include: POST_INCLUDE,
        orderBy: { createdAt: "desc" },
    });

    const skip = (page - 1) * limit;
    const personalizedPage = personalized.slice(skip, skip + limit);

    // Personalized feed covers this page — no need to pad it out.
    if (skip + personalizedPage.length < personalized.length || personalizedPage.length >= limit) {
        return { posts: personalizedPage, discoveryMode: false };
    }

    // Sparse feed (e.g. a new account following few/no one): pad the rest of the
    // page with recent posts from people the user doesn't follow yet, so the feed
    // is never emptier than it needs to be.
    const filler = await prisma.post.findMany({
        where: {
            authorId: { notIn: authorIds },
            id: { notIn: personalized.map((p) => p.id) },
        },
        include: POST_INCLUDE,
        take: limit - personalizedPage.length,
        orderBy: { createdAt: "desc" },
    });

    const posts = [...personalizedPage, ...filler].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return { posts, discoveryMode: filler.length > 0 };
}

async function getPostsByUser({ authorId, page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return prisma.post.findMany({
        where: { authorId },
        include: POST_INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
}

async function getPostById({ id }) {
    return prisma.post.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, username: true, profilePhoto: true } },
            comments: {
                include: { author: { select: { id: true, username: true } } },
                orderBy: { createdAt: 'asc' },
            },
            _count: { select: { likes: true, comments: true } },
        },
    });
}

async function getPostAuthorId(id) {
    const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
    return post?.authorId ?? null;
}

async function updatePost({ id, content }) {
    return prisma.post.update({
        where: { id },
        data: { content },
        include: POST_INCLUDE,
    });
}

async function deletePost({ id }) {
    return prisma.post.delete({ where: { id } });
}

module.exports = {
    createPost,
    getAllPosts,
    getFeedPosts,
    getPostsByUser,
    getPostById,
    getPostAuthorId,
    updatePost,
    deletePost,
};
