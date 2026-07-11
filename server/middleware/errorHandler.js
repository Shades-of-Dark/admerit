function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ error: status === 500 ? "Something went wrong" : err.message });
}

module.exports = errorHandler;
