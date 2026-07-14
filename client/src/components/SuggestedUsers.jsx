import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../api/users";
import { Avatar } from "./Avatar";
import { FollowButton } from "./FollowButton";
import { Spinner } from "./Spinner";

export function SuggestedUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers({ limit: 30 })
            .then((all) => setUsers(all.filter((u) => !u.isFollowing).slice(0, 5)))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);

    function handleFollowChange(userId, isFollowing) {
        if (isFollowing) {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        }
    }

    if (!loading && users.length === 0) return null;

    return (
        <div className="rounded-lg border border-[var(--border)] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
                Who to follow
            </h3>
            {loading && (
                <div className="flex justify-center py-4">
                    <Spinner size={18} className="text-[var(--accent)]" />
                </div>
            )}
            {!loading && <ul className="flex flex-col gap-3">
                {users.map((user) => (
                    <li key={user.id} className="flex items-center gap-2">
                        <Link
                            to={`/users/${user.id}`}
                            className="flex min-w-0 flex-1 items-center gap-2 text-inherit no-underline"
                        >
                            <Avatar username={user.username} src={user.profilePhoto} size={36} />
                            <span className="truncate text-sm font-medium text-[var(--text-h)]">
                                {user.username}
                            </span>
                        </Link>
                        <FollowButton
                            userId={user.id}
                            isFollowing={user.isFollowing}
                            onChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                        />
                    </li>
                ))}
            </ul>}
        </div>
    );
}
