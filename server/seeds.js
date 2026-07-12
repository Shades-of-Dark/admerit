require("dotenv/config");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const { prisma } = require("./prisma/client");
const { gravatarUrl } = require("./utils/gravatar");

const USER_COUNT = 25;
const SEED_PASSWORD = "password123";

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(array, count) {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
}

async function clearDatabase() {
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
}

async function seedUsers() {
    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
    const users = [];

    for (let i = 0; i < USER_COUNT; i++) {
        const username = `${faker.internet.username().replace(/[^a-zA-Z0-9_]/g, "_")}_${i}`;
        const email = faker.internet.email({ firstName: username });
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profilePhoto: Math.random() < 0.5 ? faker.image.avatarGitHub() : gravatarUrl(email),
                bio: faker.person.bio(),
                intendedMajor: faker.person.jobArea(),
            },
        });
        users.push(user);
    }

    return users;
}

async function seedFollows(users) {
    let created = 0;
    for (const user of users) {
        const others = users.filter((u) => u.id !== user.id);
        const following = pick(others, randomInt(2, 8));
        for (const target of following) {
            await prisma.follow
                .create({ data: { followerId: user.id, followingId: target.id } })
                .then(() => created++)
                .catch((err) => {
                    if (err.code !== "P2002") throw err;
                });
        }
    }
    return created;
}

async function seedPosts(users) {
    const posts = [];
    for (const user of users) {
        const postCount = randomInt(1, 6);
        for (let i = 0; i < postCount; i++) {
            const post = await prisma.post.create({
                data: {
                    content: faker.lorem.paragraph({ min: 1, max: 4 }),
                    authorId: user.id,
                },
            });
            posts.push(post);
        }
    }
    return posts;
}

async function seedComments(users, posts) {
    let created = 0;
    for (const post of posts) {
        const commenters = pick(users, randomInt(0, 5));
        for (const commenter of commenters) {
            await prisma.comment.create({
                data: {
                    content: faker.lorem.sentence(),
                    postId: post.id,
                    authorId: commenter.id,
                },
            });
            created++;
        }
    }
    return created;
}

async function seedLikes(users, posts) {
    let created = 0;
    for (const post of posts) {
        const likers = pick(users, randomInt(0, users.length));
        for (const liker of likers) {
            await prisma.like
                .create({ data: { postId: post.id, userId: liker.id } })
                .then(() => created++)
                .catch((err) => {
                    if (err.code !== "P2002") throw err;
                });
        }
    }
    return created;
}

async function main() {
    console.log("Clearing existing data...");
    await clearDatabase();

    console.log(`Creating ${USER_COUNT} users (password for all: "${SEED_PASSWORD}")...`);
    const users = await seedUsers();

    console.log("Creating follow relationships...");
    const followCount = await seedFollows(users);

    console.log("Creating posts...");
    const posts = await seedPosts(users);

    console.log("Creating comments...");
    const commentCount = await seedComments(users, posts);

    console.log("Creating likes...");
    const likeCount = await seedLikes(users, posts);

    console.log("\nSeed complete:");
    console.log(`  users:    ${users.length}`);
    console.log(`  follows:  ${followCount}`);
    console.log(`  posts:    ${posts.length}`);
    console.log(`  comments: ${commentCount}`);
    console.log(`  likes:    ${likeCount}`);
    console.log(`\nLog in as any seeded user with password "${SEED_PASSWORD}".`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
