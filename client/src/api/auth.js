import { parseErrorResponse } from "./http";

export async function signup(userData) {
    const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
    });
    if (!res.ok) await parseErrorResponse(res, "Signup failed");
    return res.json();
}


export async function login(username, password) {
    const res = await fetch("/log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) await parseErrorResponse(res, "Login failed");
    return res.json();
}
export async function logout() {
    const res = await fetch("/log-out", { method: "POST", credentials: "include" });
    return res.json();
}

export async function getSession() {
    const res = await fetch("/api/v1/session", { credentials: "include" });
    return res.json();
}