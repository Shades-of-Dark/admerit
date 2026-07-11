const {
    createPost,
    getAllPosts,
    getPostsByUser,
    getPostById,
    getPostAuthorId,
    updatePost,
    deletePost,
} = require("../prisma/postQueries");

async function createPostHandler(req, res, next) {
    try {
        const post = await createPost({ content: req.body.content, authorId: req.user.id });
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
}

async function getAllPostsHandler(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const posts = await getAllPosts({ page, limit });
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function getPostsByUserHandler(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const posts = await getPostsByUser({ authorId: Number(req.params.userId), page, limit });
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function getPostByIdHandler(req, res, next) {
    try {
        const post = await getPostById(Number(req.params.id));
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function updatePostHandler(req, res, next) {
    try {
        const id = Number(req.params.id);
        const authorId = await getPostAuthorId(id);
        if (authorId === null) return res.status(404).json({ error: "Post not found" });
        if (authorId !== req.user.id) return res.status(403).json({ error: "You can only edit your own posts" });

        const updated = await updatePost({ id, content: req.body.content });
        res.json(updated);
    } catch (error) {
        next(error);
    }
}

async function deletePostHandler(req, res, next) {
    try {
        const id = Number(req.params.id);
        const authorId = await getPostAuthorId(id);
        if (authorId === null) return res.status(404).json({ error: "Post not found" });
        if (authorId !== req.user.id) return res.status(403).json({ error: "You can only delete your own posts" });

        await deletePost({ id });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPostHandler,
    getAllPostsHandler,
    getPostsByUserHandler,
    getPostByIdHandler,
    updatePostHandler,
    deletePostHandler,
};
