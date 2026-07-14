import { useState } from "react";
import { followUser, unfollowUser } from "../api/users";
import { Spinner } from "./Spinner";

export function FollowButton({ userId, isFollowing, onChange }) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);

    async function toggle() {
        setPending(true);
        setError(null);
        try {
            if (isFollowing) {
                await unfollowUser(userId);
                onChange?.(false);
            } else {
                await followUser(userId);
                onChange?.(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={toggle}
                disabled={pending}
                className={
                    isFollowing
                        ? "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--accent)] bg-transparent px-4 py-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-bg)] disabled:cursor-default disabled:opacity-60"
                        : "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent-contrast)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
                }
            >
                {pending && <Spinner size={13} />}
                {isFollowing ? "Following" : "Follow"}
            </button>
            {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
        </div>
    );
}
