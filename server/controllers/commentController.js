const {
    createComment, deleteComment, updateComment, getCommentById, getCommentsByPost
} = require("../prisma/commentQueries");

async function createCommentPost(req, res) {
    try {
        const { content } = req.body;
        const postId = Number(req.params.postId);

        const comment = await createComment({
            content,
            postId,
            authorId: req.user.id, // from the session, not req.body — never trust client-supplied identity
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create comment" });
    }
}

async function getAllCommentsHandler(req, res) {
    try {
        const postId = Number(req.params.postId);
        const comments = await getCommentsByPost({ postId });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
}

async function updateCommentHandler(req, res) {
    try {
        const id = Number(req.params.commentId);
        const { content } = req.body;

        const comment = await getCommentById({ id });
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        if (comment.authorId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to edit this comment" });
        }

        const updated = await updateComment({ id, content });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update comment" });
    }
}

async function deleteCommentHandler(req, res) {
    try {
        const id = Number(req.params.commentId);

        const comment = await getCommentById({ id });
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        if (comment.authorId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to delete this comment" });
        }

        await deleteComment({ id });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
}

module.exports = { createCommentPost, deleteCommentHandler, updateCommentHandler, getAllCommentsHandler };