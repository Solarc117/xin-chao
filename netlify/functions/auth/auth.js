const { MongoClient } = require('mongodb'),
  mongoClient = new MongoClient(process.env.URI),
  clientPromise = mongoClient.connect()

exports.handler = async function (event, context) {
  const { httpMethod } = event,
    { username, password } = JSON.parse(event.body)

  if (httpMethod !== 'POST')
    return {
      statusCode: 404,
      body: JSON.stringify({ clientError: '404 not found' }),
    }
  if (!username || !password)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'missing user or password fields' }),
    }

  try {
    const database = (await clientPromise).db(process.env.DATABASE),
      collection = database.collection(process.env.COLLECTION),
      adminUser = await collection.findOne({ username })

    if (
      adminUser === null ||
      !require('bcrypt').compareSync(password, adminUser.password)
    )
      return {
        statusCode: 400,
        body: JSON.stringify({
          clientError: 'invalid username or password',
        }),
      }

    const token = require('jsonwebtoken').sign(
      {
        username,
      },
      process.env.SESSION_SECRET,
      {
        expiresIn: '24h',
      }
    )

    document.cookie = 

    return {
      statusCode: 200,
      headers: {
        'set-cookie': `jwt=${token}; secure; httpOnly; sameSite=Lax`,
      },
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        serverError: error.toString(),
      }),
    }
  }
}
