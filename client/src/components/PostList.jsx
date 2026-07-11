import { Link } from "react-router-dom";

export function PostList({ posts }) {
    if (posts.length === 0) return <p>No posts yet.</p>;

    return (
        <ul className="post-list">
            {posts.map((post) => (
                <li key={post.id} className="post-card">
                    <Link to={`/posts/${post.id}`} className="post-card-link">
                        <p className="post-author">{post.author.username}</p>
                        <p className="post-content">{post.content}</p>
                        <p className="post-meta">
                            {post._count.likes} likes · {post._count.comments} comments
                        </p>
                    </Link>
                </li>
            ))}
        </ul>
    );
}