const { prisma } = require("./client");

const AUTHOR_SELECT = { id: true, username: true, profilePhoto: true };

async function createPost({ content, authorId }) {
    return prisma.post.create({
        data: { content, authorId },
        include: {
            author: { select: AUTHOR_SELECT },
            _count: { select: { comments: true, likes: true } },
        },
    });
}

async function getAllPosts({ page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return prisma.post.findMany({
        include: {
            author: { select: AUTHOR_SELECT },
            _count: { select: { comments: true, likes: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
}

async function getPostsByUser({ authorId, page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return prisma.post.findMany({
        where: { authorId },
        include: {
            author: { select: AUTHOR_SELECT },
            _count: { select: { comments: true, likes: true } },
        },
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
        include: {
            author: { select: AUTHOR_SELECT },
            _count: { select: { comments: true, likes: true } },
        },
    });
}

async function deletePost({ id }) {
    return prisma.post.delete({ where: { id } });
}

module.exports = {
    createPost,
    getAllPosts,
    getPostsByUser,
    getPostById,
    getPostAuthorId,
    updatePost,
    deletePost,
};
