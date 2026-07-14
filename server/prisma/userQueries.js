const { prisma } = require("./client");

async function createUser({ username, email, password, profilePhoto, bio, intendedMajor }) {
    return prisma.user.create({
        data: { username, email, password, profilePhoto, bio, intendedMajor },
    });

}

async function updateUser({ id, username, email, password, profilePhoto, bio, intendedMajor }) {
    return prisma.user.update({
        where: { id },
        data: {
            username,
            email,
            password,
            profilePhoto,
            bio,
            intendedMajor,
        },
    });

}


async function deleteUser({ id }) {
    return prisma.user.delete({ where: { id } });

}

async function findUserByID({ id }) {
    return prisma.user.findUnique({ where: { id } });

}

async function findUserByUsername({ username }) {
    return prisma.user.findUnique({ where: { username } });

}

async function findUserByEmail({ email }) {
    return prisma.user.findUnique({ where: { email } });

}

function deriveUsernameBase(displayName) {
    return displayName.replace(/\s+/g, "").toLowerCase();
}

async function generateUniqueUsername(baseUsername) {
    let candidate = baseUsername;
    let attempt = 0;

    while (await findUserByUsername({ username: candidate })) {
        attempt++;
        // append a short random suffix, e.g. "vedhraja" -> "vedhraja4821"
        const suffix = Math.floor(1000 + Math.random() * 9000);
        candidate = `${baseUsername}${suffix}`;

        if (attempt > 5) {
            // extremely unlikely fallback — timestamp guarantees uniqueness
            candidate = `${baseUsername}${Date.now()}`;
            break;
        }
    }

    return candidate;
}

async function getAllUsers({ page = 1, limit = 20, currentUserId } = {}) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
        where: currentUserId ? { id: { not: currentUserId } } : undefined,
        select: {
            id: true,
            username: true,
            profilePhoto: true,
            bio: true,
            _count: { select: { followers: true, following: true } },
            followers: currentUserId
                ? { where: { followerId: currentUserId }, select: { id: true } }
                : false,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
    });

    return users.map(({ followers, ...user }) => ({
        ...user,
        isFollowing: currentUserId ? followers.length > 0 : false,
    }));
}
async function findOrCreateGithubUser({ githubId, username, email, profilePhoto }) {

    let user = await prisma.user.findUnique({ where: { githubId } });
    if (user) return user;


    if (email) {
        const existingByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingByEmail) {
            return prisma.user.update({
                where: { id: existingByEmail.id },
                data: { githubId },
            });
        }
    }


    const uniqueUsername = await generateUniqueUsername(username);

    return prisma.user.create({
        data: {
            githubId,
            username: uniqueUsername,
            email: email || `${username}-${githubId}@no-email.admerit`,
            profilePhoto,
        },
    });
}

async function getUserProfile({ id, currentUserId }) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            profilePhoto: true,
            bio: true,
            intendedMajor: true,
            createdAt: true,
            _count: { select: { followers: true, following: true, posts: true } },
            followers: currentUserId
                ? { where: { followerId: currentUserId }, select: { id: true } }
                : false,
        },
    });
    if (!user) return null;

    const { followers, ...safeUser } = user;
    return {
        ...safeUser,
        isFollowing: currentUserId ? followers.length > 0 : false,
    };
}

async function findOrCreateGoogleUser({ googleId, username, email, profilePhoto }) {
    let user = await prisma.user.findUnique({ where: { googleId } });
    if (user) return user;

    if (email) {
        const existingByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingByEmail) {
            return prisma.user.update({
                where: { id: existingByEmail.id },
                data: { googleId },
            });
        }
    }

    const uniqueUsername = await generateUniqueUsername(username);

    return prisma.user.create({
        data: { googleId, username: uniqueUsername, email, profilePhoto },
    });
}
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    findUserByID,
    findUserByUsername,
    findUserByEmail,
    getAllUsers,
    getUserProfile,
    findOrCreateGithubUser,
    findOrCreateGoogleUser
};

