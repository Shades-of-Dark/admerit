import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

export function CommentList({ comments }) {
    if (comments.length === 0) {
        return <p className="text-sm text-[var(--text)]">No comments yet — be the first to say something.</p>;
    }

    return (
        <ul className="divide-y divide-[var(--border)]">
            {comments.map((comment) => (
                <li key={comment.id} className="flex items-start gap-3 py-3 first:pt-0">
                    <Link to={`/users/${comment.author.id}`} className="inline-flex shrink-0">
                        <Avatar username={comment.author.username} src={comment.author.profilePhoto} size={28} />
                    </Link>
                    <div className="min-w-0">
                        <Link
                            to={`/users/${comment.author.id}`}
                            className="text-sm font-semibold text-[var(--text-h)] no-underline hover:text-[var(--accent)]"
                        >
                            {comment.author.username}
                        </Link>
                        <p className="whitespace-pre-wrap text-sm text-[var(--text)]">{comment.content}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
