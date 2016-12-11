export default {
  mongoHost: process.env.env === 'production' ? 'mongo/messenger' : 'localhost/messenger',
  redisHost: process.env.env === 'production' ? 'redis' : 'localhost',
  secret: 'simple-messenger-secret',
}
