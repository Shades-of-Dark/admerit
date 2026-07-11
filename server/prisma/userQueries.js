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

async function getAllUsers({ page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
        select: { id: true, username: true, profilePhoto: true, bio: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
    });
}

module.exports = { createUser, updateUser, deleteUser, findUserByID, findUserByUsername, findUserByEmail, getAllUsers };

