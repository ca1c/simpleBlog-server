const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: `${process.env.DB_URL}${process.env.DB_NAME}`,
    collection: 'userSessions'
})

module.exports = store;