import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../api/users";
import { Avatar } from "../components/Avatar";
import { FollowButton } from "../components/FollowButton";
import { FormAlert } from "../components/FormFeedback";

export function UsersIndex() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function handleFollowChange(userId, isFollowing) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isFollowing } : u)));
    }

    if (loading) return <p className="py-8 text-center text-[var(--text)]">Loading users...</p>;

    return (
        <div>
            <h2>Users</h2>
            <FormAlert>{error}</FormAlert>
            {users.length === 0 && !error && (
                <p className="py-8 text-center text-[var(--text)]">No other users yet.</p>
            )}
            <ul className="m-0 mt-4 grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 p-0">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3.5"
                    >
                        <Link to={`/users/${user.id}`} className="flex min-w-0 flex-1 items-center gap-3 text-inherit no-underline">
                            <Avatar username={user.username} src={user.profilePhoto} size={56} />
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-[var(--text-h)]">{user.username}</p>
                                {user.bio && (
                                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[var(--text)]">
                                        {user.bio}
                                    </p>
                                )}
                                <p className="mt-0.5 text-xs text-[var(--text)]">
                                    {user._count.followers} followers · {user._count.following} following
                                </p>
                            </div>
                        </Link>
                        <FollowButton
                            userId={user.id}
                            isFollowing={user.isFollowing}
                            onChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
