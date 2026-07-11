import { useState } from "react";
import { createPost } from "../api/posts";
import { FieldError } from "./FormFeedback";

export function PostForm({ onPostCreated }) {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const post = await createPost(content);
            setContent("");
            onPostCreated?.(post);
        } catch (err) {
            setError(err.fieldErrors?.content || err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
            />
            <FieldError>{error}</FieldError>
            <button type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
