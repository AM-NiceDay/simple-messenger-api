export default {
  mongoHost: process.env.NODE_ENV === 'production' ? 'mongo/messenger' : 'localhost/messenger',
  redisHost: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
  secret: 'simple-messenger-secret',
}
