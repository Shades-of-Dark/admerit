export function CommentList({ comments }) {
    if (comments.length === 0) return <p>No comments yet.</p>;

    return (
        <ul className="post-list">
            {comments.map((comment) => (
                <li key={comment.id} className="post-card">
                    <p className="post-author">{comment.author.username}</p>
                    <p className="post-content">{comment.content}</p>
                </li>
            ))}
        </ul>
    );
}