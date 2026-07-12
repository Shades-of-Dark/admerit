const crypto = require("node:crypto");
const { createUser, findUserByID, updateUser, getAllUsers, getUserProfile } = require("../prisma/userQueries");
const bcrypt = require("bcryptjs");
const { gravatarUrl } = require("../utils/gravatar");

async function createUserPost(req, res, next) {
    try {
        const { username, email, password, profilePhoto, bio, intendedMajor } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            username,
            email,
            password: hashedPassword,
            profilePhoto: profilePhoto || gravatarUrl(email),
            bio,
            intendedMajor,
        });

        const { password: _, ...safeUser } = user;

        req.login(user, (err) => {
            if (err) return next(err);
            res.status(201).json(safeUser);
        });
    } catch (error) {
        if (error.code === "P2002") {
            const field = error.meta?.target?.[0] || "username";
            const message = field === "email" ? "An account with this email already exists" : "Username is already taken";
            return res.status(400).json({ errors: { [field]: message } });
        }
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
}

async function guestLoginHandler(req, res, next) {
    try {
        const suffix = crypto.randomBytes(4).toString("hex");
        const username = `Guest_${suffix}`;
        const email = `guest_${suffix}@example.com`;
        const password = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

        const user = await createUser({
            username,
            email,
            password,
            profilePhoto: gravatarUrl(email),
            bio: "Just browsing as a guest.",
            intendedMajor: null,
        });

        req.login(user, (err) => {
            if (err) return next(err);
            const { password: _, ...safeUser } = user;
            res.status(201).json({ user: safeUser });
        });
    } catch (error) {
        next(error);
    }
}

async function getUserByIdHandler(req, res) {
    try {
        const profile = await getUserProfile({ id: Number(req.params.id), currentUserId: req.user?.id });
        if (!profile) return res.status(404).json({ error: "User not found" });
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
}

async function updateUserHandler(req, res) {
    try {
        const updatedUser = await updateUser({ id: req.user.id, ...req.body });
        const { password, ...safeUser } = updatedUser;
        res.json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
}

async function getAllUsersHandler(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const users = await getAllUsers({ page, limit, currentUserId: req.user?.id });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
}

module.exports = { createUserPost, guestLoginHandler, getUserByIdHandler, updateUserHandler, getAllUsersHandler };