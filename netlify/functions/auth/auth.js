import { MongoClient } from 'mongodb'
import { mongoConfig } from '../config'

const { URI, DATABASE, USER_COLLECTION, SESSION_SECRET } = process.env,
  clientPromise = new MongoClient(URI, mongoConfig)

export const handler = async function (event, context) {
  const { httpMethod } = event,
    { username, password } = JSON.parse(event.body)

  if (httpMethod !== 'POST')
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'not found' }),
    }

  if (!username || !password)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'missing username or password fields' }),
    }

  try {
    const database = (await clientPromise).db(DATABASE),
      collection = database.collection(USER_COLLECTION),
      adminUser = await collection.findOne({ username })

    await clientPromise.close()

    const bcrypt = await import('bcrypt')
    if (adminUser === null || !bcrypt.compareSync(password, adminUser.password))
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'incorrect username or password',
        }),
      }

    const jwt = await import('jsonwebtoken'),
      token = jwt.sign(
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
