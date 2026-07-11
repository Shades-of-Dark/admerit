const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv/config");
const LocalStrategy = require('passport-local').Strategy;

const app = express();

const commentRouter = require("./routes/commentRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const { loginValidators } = require("./validators/userValidators");
const handleValidationErrors = require("./middleware/handleValidationErrors");
const { loginLimiter } = require("./middleware/rateLimiters");
const errorHandler = require("./middleware/errorHandler");

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
//app.use("/api/v1/posts/:userId/followers", followRouter);
//app.use("/api/v1/posts/:postId/likes", likeRouter);

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

const PORT = Number(process.env.PORT);


app.listen(PORT, (error) => { if (error) { throw error; } console.log(`Website running on port ${PORT}!`); });