// client/src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CommentList } from "../components/CommentList";
import { CommentForm } from "../components/CommentForm";
import { LikeButton } from "../components/LikeButton";
import { Avatar } from "../components/Avatar";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/v1/posts/${postId}`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                setLoading(false);
            });
    }, [postId]);

    if (loading) return <p className="py-8 text-center text-[var(--text)]">Loading...</p>;
    if (!post) return <p className="py-8 text-center text-[var(--text)]">Post not found.</p>;

    function handleCommentCreated(comment) {
        setPost((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    }

    return (
        <div className="max-w-2xl">
            <Link
                to="/"
                className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--text)] no-underline hover:text-[var(--accent)]"
            >
                <span aria-hidden="true">←</span> Back to feed
            </Link>

            <article className="mb-8 border-b border-[var(--border)] pb-6">
                <div className="mb-4 flex items-center gap-3">
                    <Link to={`/users/${post.author.id}`} className="inline-flex">
                        <Avatar username={post.author.username} src={post.author.profilePhoto} size={48} />
                    </Link>
                    <div>
                        <Link
                            to={`/users/${post.author.id}`}
                            className="block font-semibold leading-tight text-[var(--text-h)] no-underline hover:text-[var(--accent)]"
                        >
                            {post.author.username}
                        </Link>
                        <span className="text-xs text-[var(--text)]">{formatDate(post.createdAt)}</span>
                    </div>
                </div>

                <p className="mb-4 whitespace-pre-wrap text-lg leading-relaxed text-[var(--text-h)]">
                    {post.content}
                </p>

                <p className="mb-4 text-sm text-[var(--text)]">
                    {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
                </p>

                <div className="border-t border-[var(--border)] pt-4">
                    <LikeButton postId={postId} />
                </div>
            </article>

            <section>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
                    Comments
                </h3>
                <CommentList comments={post.comments} />
                <div className="mt-5">
                    <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />
                </div>
            </section>
        </div>
    );
}
