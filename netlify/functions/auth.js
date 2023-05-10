import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MongoClient } from 'mongodb'

const { URI, DATABASE, USER_COLLECTION, SESSION_SECRET } = process.env,
  client = new MongoClient(URI, {
    appName: 'Xin Chào Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  })

export async function handler(event, context) {
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
    await client.connect()

    const database = client.db(DATABASE),
      collection = database.collection(USER_COLLECTION),
      adminUser = await collection.findOne({ username })

    await client.close()

    if (adminUser === null || !bcrypt.compareSync(password, adminUser.password))
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'incorrect username or password',
        }),
      }

    const token = jwt.sign(
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
