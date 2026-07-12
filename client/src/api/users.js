import { parseErrorResponse } from "./http";

export async function getUsers({ page = 1, limit = 20 } = {}) {
    const res = await fetch(`/api/v1/users?page=${page}&limit=${limit}`, { credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to load users");
    return res.json();
}

export async function getUserById(id) {
    const res = await fetch(`/api/v1/users/${id}`, { credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to load user");
    return res.json();
}

export async function getUserPosts(id, { page = 1, limit = 20 } = {}) {
    const res = await fetch(`/api/v1/posts/user/${id}?page=${page}&limit=${limit}`, { credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to load posts");
    return res.json();
}

export async function followUser(id) {
    const res = await fetch(`/api/v1/users/${id}/follow`, { method: "POST", credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to follow user");
    return res.json();
}

export async function unfollowUser(id) {
    const res = await fetch(`/api/v1/users/${id}/follow`, { method: "DELETE", credentials: "include" });
    if (!res.ok) await parseErrorResponse(res, "Failed to unfollow user");
}
