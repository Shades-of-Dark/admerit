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
        <button onClick={toggleLike} className="like-button">
            <img
                src={state.liked ? "/thumbs-up-filled.svg" : "/thumbsup.svg"}
                alt={state.liked ? "Liked" : "Not liked"}
                width={20}
                height={20}
            />
            <span>{state.count}</span>
        </button>
    );
}