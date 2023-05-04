// Hours imports.
import fetch from 'node-fetch'
// Menu imports.
import { MongoClient } from 'mongodb'

const { GOOGKE_KEY, PLACE_ID, URI, DATABASE, PRODUCT_COLLECTION } = process.env,
  CLIENT = new MongoClient(URI, {
    appName: 'Xin Chào Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  })

export async function handler(event, context) {
  /**
   * @returns {Promise<import('mongodb').Document[] | string>}
   */
  async function getMenu() {
    let cursor, products
    try {
      await CLIENT.connect()

      cursor = await CLIENT.db(DATABASE)
        .collection(PRODUCT_COLLECTION)
        .aggregate([
          {
            $group: {
              _id: '$category',
              products: { $push: '$$ROOT' },
            },
          },
          {
            $addFields: {
              category: '$_id',
            },
          },
        ])
      products = await cursor.toArray()

      await CLIENT.close()
    } catch (error) {
      console.error('Could not fetch menu:', error)
      return error.toString()
    }

    return products
  }
  /**
   * @returns {Promise<{ openingHours: Array, dateFetched: string } | string>}
   */
  async function getHours() {
    let response, data
    try {
      response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=opening_hours&key=${GOOGLE_KEY}`
      )
      data = await response.json()
    } catch (error) {
      console.error('Could not fetch store hours:', error)
      return error.toString()
    }

    return {
      openingHours: data.result.opening_hours.weekday_text,
      dateFetched: new Date().toLocaleDateString(),
    }
  }

  const { httpMethod } = event

  if (httpMethod !== 'GET')
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'not found' }),
    }

  const [menu, hours] = await Promise.all([getMenu(), getHours()])

  return {
    statusCode:
      typeof menu === 'string' || typeof hours === 'string' ? 207 : 200,
    body: JSON.stringify({ menu, hours }),
  }
}
