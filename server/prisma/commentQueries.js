const { prisma } = require("./client");

const AUTHOR_SELECT = { id: true, username: true, profilePhoto: true };

async function createComment({ content, postId, authorId }) {
    return prisma.comment.create({
        data: { content, postId, authorId },
        include: { author: { select: AUTHOR_SELECT } },
    });
}

async function getCommentsByPost({ postId }) {
    return prisma.comment.findMany({
        where: { postId },
        include: { author: { select: AUTHOR_SELECT } },
        orderBy: { createdAt: "asc" },
    });
}

async function getCommentById(id) {
    return prisma.comment.findUnique({ where: { id } });
}

async function updateComment({ id, content }) {
    return prisma.comment.update({
        where: { id },
        data: { content },
        include: { author: { select: AUTHOR_SELECT } },
    });
}

async function deleteComment({ id }) {
    return prisma.comment.delete({ where: { id } });
}

module.exports = { createComment, getCommentsByPost, getCommentById, updateComment, deleteComment };
