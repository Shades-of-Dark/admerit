import { parseErrorResponse } from "./http";

export async function getComments(postId, { page = 1, limit = 20 } = {}) {
    const res = await fetch(`/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`, { credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to load comments");
    return res.json();
}

export async function createComment(postId, content) {
    const res = await fetch(`/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
    });
    if (!res.ok) await parseErrorResponse(res, "Failed to create comment");
    return res.json();
}
