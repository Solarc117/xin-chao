const { MongoClient } = require('mongodb'),
  { URI, DATABASE, USER_COLLECTION, SESSION_SECRET } = process.env,
  mongoClient = new MongoClient(URI),
  clientPromise = mongoClient.connect()

exports.handler = async function (event, context) {
  const { httpMethod } = event,
    { username, password } = JSON.parse(event.body)

  if (httpMethod !== 'POST')
    return {
      statusCode: 404,
      body: JSON.stringify({ clientError: 'not found' }),
    }

  if (!username || !password)
    return {
      statusCode: 400,
      body: JSON.stringify({ clientError: 'missing user or password fields' }),
    }

  try {
    const database = (await clientPromise).db(DATABASE),
      collection = database.collection(USER_COLLECTION),
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
      SESSION_SECRET,
      {
        expiresIn: '24h',
      }
    )

    return {
      statusCode: 200,
      headers: {
        'set-cookie': `jwt=${token}; secure; httpOnly; sameSite=Lax`,
      },
      body: JSON.stringify({
        username,
        token,
      }),
    }
  } catch (error) {
    console.error(error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        serverError: error.toString(),
      }),
    }
  }
}
