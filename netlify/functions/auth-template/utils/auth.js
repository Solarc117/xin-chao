const { sign } = require('jsonwebtoken'),
  passport = require('passport'),
  passportJwt = require('passport-jwt'),
  { BASE_URL, ENDPOINT, SECRET } = require('./config.js')

function authJwt(email) {
  return sign({ user: { email } }, SECRET)
}

function applyPassportStrategies() {
  passport.use(getJwtStrategy())
}

function getJwtStrategy() {
  return new passportJwt.Strategy(
    {
      jwtFromRequest(req) {
        if (!req.cookies) throw new Error('Missing cookie-parser middleware')
        return req.cookies.jwt
      },
      secretOrKey: SECRET,
    },
    async ({ user: { email } }, done) => {
      try {
        // Here you'd typically load an existing user
        // and use the data to create the JWT.
        const jwt = authJwt(email)

        return done(null, { email, jwt })
      } catch (error) {
        return done(error)
      }
    }
  )
}

module.exports = {
  applyPassportStrategies,
}
