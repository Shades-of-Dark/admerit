// client/src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CommentList } from "../components/CommentList";
import { CommentForm } from "../components/CommentForm";
import { LikeButton } from "../components/LikeButton";

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

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>Post not found.</p>;

    function handleCommentCreated(comment) {
        setPost((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    }

    return (
        <div className="post-detail">
            <Link to="/">← Back to feed</Link>
            <p className="post-author">{post.author.username}</p>
            <p className="post-content">{post.content}</p>
            <p className="post-meta">{post._count.likes} likes</p>

            <CommentList postId={postId} comments={post.comments} />
            <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />
            <LikeButton postId={postId} />
        </div>
    );
}