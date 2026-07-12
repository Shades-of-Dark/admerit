import { useState, useEffect } from "react";

export function LikeButton({ postId }) {
    const [state, setState] = useState({ count: 0, liked: false });

    useEffect(() => {
        fetch(`/api/v1/posts/${postId}/likes`, { credentials: "include" })
            .then(res => res.json())
            .then(setState);
    }, [postId]);

    async function toggleLike() {
        const method = state.liked ? "DELETE" : "POST";
        await fetch(`/api/v1/posts/${postId}/likes`, { method, credentials: "include" });
        setState(prev => ({ count: prev.liked ? prev.count - 1 : prev.count + 1, liked: !prev.liked }));
    }

    return (
        <button
            onClick={toggleLike}
            className={
                state.liked
                    ? "inline-flex items-center gap-2 rounded-full border border-(--accent) bg-(--accent-bg) px-4 py-2 text-sm font-medium text-[var(--accent)]"
                    : "inline-flex items-center gap-2 rounded-full border border-(--border) px-4 py-2 text-sm font-medium text-(--text) hover:bg-[var(--social-bg)]"
            }
        >
            <img
                src={state.liked ? "/thumbs-up-filled.svg" : "/thumbsup.svg"}
                alt={state.liked ? "Liked" : "Not liked"}
                width={18}
                height={18}
            />
            <span>{state.count} {state.count === 1 ? "like" : "likes"}</span>
        </button>
    );
}