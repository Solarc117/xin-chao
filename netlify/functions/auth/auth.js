// details: https://markus.oberlehner.net/blog/implementing-an-authentication-flow-with-passport-and-netlify-functions/

const cookieParser = require('cookie-parser'),
  express = require('express'),
  passport = require('passport'),
  serverless = require('serverless-http'),
  { applyPassportStrategies } = require('./utils/auth.js'),
  { COOKIE_SECURE, ENDPOINT } = require('./utils/config.js')
applyPassportStrategies()
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

function handleCallback(req, res) => {
  res
    .cookie('jwt', req.user.jwt, { httpOnly: true, COOKIE_SECURE })
    .redirect('/')
}

app.get(
  `${ENDPOINT}/auth/status`,
  passport.authenticate('jwt', { session: false }),
  (req, res) => res.json({ email: req.user.email })
)

const handler = serverless(app)

module.exports = { handler }
