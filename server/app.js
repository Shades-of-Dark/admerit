const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv/config");
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const app = express();

const commentRouter = require("./routes/commentRouter");
const likeRouter = require("./routes/likeRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const followRouter = require("./routes/followRouter");
const { loginValidators } = require("./validators/userValidators");
const handleValidationErrors = require("./middleware/handleValidationErrors");
const { loginLimiter, signupLimiter } = require("./middleware/rateLimiters");
const errorHandler = require("./middleware/errorHandler");
const { guestLoginHandler } = require("./controllers/userController");
const {findOrCreateGithubUser} = require("./prisma/userQueries")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize())
app.use(passport.session());


const { findUserByUsername, findUserByEmail, findUserByID } = require("./prisma/userQueries");
const bcrypt = require("bcryptjs");

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateGithubUser({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.noemail`,
            profilePhoto: profile.photos?.[0]?.value,
        });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
passport.use(new LocalStrategy(async (identifier, password, done) => {
    try {
        const user = identifier.includes("@")
            ? await findUserByEmail({ email: identifier })
            : await findUserByUsername({ username: identifier });
        if (!user) return done(null, false, { message: "Invalid username or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Invalid username or password" });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserByID({ id });
        done(null, user);
    } catch (err) {
        done(err);
    }
});
app.get("/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/auth/github/callback",
    passport.authenticate("github", {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=github`,
        session: true,
    }),
    (req, res) => {
        // successful login — redirect back to React, session cookie already set
        res.redirect(process.env.CLIENT_URL);
    }
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/:userId/follow", followRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/posts/:postId/likes", likeRouter);

app.use("/api/v1/posts/:postId/comments", commentRouter);

app.post("/log-in", loginLimiter, loginValidators, handleValidationErrors, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || "Invalid username or password" });
        req.logIn(user, (err) => {
            if (err) return next(err);
            const { password, ...safeUser } = user;
            return res.json({ user: safeUser });
        });
    })(req, res, next);
});

app.post("/guest-login", signupLimiter, guestLoginHandler);

app.post("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: "Logged out" });
    });
});


app.get("/api/v1/session", (req, res) => {
    if (req.user) {
        const { password, ...safeUser } = req.user;
        res.json({ user: safeUser });
    } else {
        res.json({ user: null });
    }
});


app.use(errorHandler);

const PORT = Number(process.env.SERVER_PORT);


app.listen(PORT, (error) => { if (error) { throw error; } console.log(`Website running on port ${PORT}!`); });