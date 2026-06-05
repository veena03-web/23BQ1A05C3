function logger(req, res, next) {

    const method = req.method;
    const url = req.url;
    const time = new Date().toISOString();

    process.stdout.write(
        `[${time}] ${method} ${url}\n`
    );

    next();

}

module.exports = logger;