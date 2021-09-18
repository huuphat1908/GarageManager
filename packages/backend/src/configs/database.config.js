module.exports = {
    URL: `mongodb+srv://${process.env.APP_DB_USERNAME}:${process.env.APP_DB_PW}@cluster0.zeo9p.mongodb.net/${process.env.APP_DB_NAME}?retryWrites=true&w=majority`
}