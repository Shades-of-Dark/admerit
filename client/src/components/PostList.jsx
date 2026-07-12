import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

export function PostList({ posts }) {
    if (posts.length === 0) return <p className="py-8 text-center text-[var(--text)]">No posts yet.</p>;

    return (
        <ul className="post-list">
            {posts.map((post) => (
                <li className="post-card transition-colors hover:bg-[var(--social-bg)]" key={post.id}>
                    <div className="mb-1.5 flex items-center gap-2">
                        <Link to={`/users/${post.author.id}`} className="inline-flex">
                            <Avatar username={post.author.username} src={post.author.profilePhoto} size={36} />
                        </Link>
                        <Link to={`/users/${post.author.id}`} className="post-author hover:text-[var(--accent)]">
                            {post.author.username}
                        </Link>
                    </div>
                    <Link to={`/posts/${post.id}`} className="block cursor-pointer text-inherit no-underline">
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