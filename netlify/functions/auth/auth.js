const session = require('express-session'),
  passport = require('passport'),
  express = require('express'),
  { MongoClient } = require('mongodb'),
  LocalStrategy = require('passport-local'),
  app = express(),
  mongoClient = new MongoClient(process.env.URI),
  clientPromise = mongoClient.connect()

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)
app.use(passport.initialize())
app.use(passport.session())

exports.handler = async function (event, context) {
  const { method, user, password } = event
  console.log('method:', method)
  if ()

  try {
    const database = (await clientPromise).db(process.env.DATABASE),
      collection = database.collection(process.env.COLLECTION)

    passport.use(
      new LocalStrategy(async (username, password, done) => {
        let admin
        try {
          admin = await collection.findOne()
        } catch (error) {
          console.error(error)
          return done(error)
        }

        console.log('admin:', admin)
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}
