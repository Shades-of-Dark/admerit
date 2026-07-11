import { parseErrorResponse } from "./http";

export async function getPosts({ page = 1, limit = 20 } = {}) {
    const res = await fetch(`/api/v1/posts?page=${page}&limit=${limit}`, { credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to load posts");
    return res.json();
}

export async function createPost(content) {
    const res = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
    });
    if (!res.ok) await parseErrorResponse(res, "Failed to create post");
    return res.json();
}
