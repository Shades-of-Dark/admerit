const { createUser, findUserByID, updateUser, getAllUsers } = require("../prisma/userQueries");
const bcrypt = require("bcryptjs");

async function createUserPost(req, res, next) {
    try {
        const { username, email, password, profilePhoto, bio, intendedMajor } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            username,
            email,
            password: hashedPassword,
            profilePhoto,
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

async function getUserByIdHandler(req, res) {
    try {
        const user = await findUserByID({ id: Number(req.params.id) });
        if (!user) return res.status(404).json({ error: "User not found" });
        const { password, ...safeUser } = user;
        res.json(safeUser);
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
        const users = await getAllUsers({ page, limit });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
}

module.exports = { createUserPost, getUserByIdHandler, updateUserHandler, getAllUsersHandler };