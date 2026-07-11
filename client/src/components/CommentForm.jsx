import { useState } from "react";
import { createComment } from "../api/comments";
import { FieldError } from "./FormFeedback";

export function CommentForm({ postId, onCommentCreated }) {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const comment = await createComment(postId, content);
            setContent("");
            onCommentCreated?.(comment);
        } catch (err) {
            setError(err.fieldErrors?.content || err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <label for="comment-box">Leave a comment</label>
            <textarea
                id="comment-box"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts?"
                rows={3}
            />
            <FieldError>{error}</FieldError>
            <button type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
