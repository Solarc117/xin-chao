const { MongoClient, MongoError } = require('mongodb'),
  { URI, DATABASE, PRODUCT_COLLECTION } = process.env,
  mongoClient = new MongoClient(URI, {
    appName: 'Xin Chao Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  }),
  clientPromise = mongoClient.connect()

class MenuDAO {
  static async createItem(item) {
    const database = (await clientPromise).db(DATABASE),
      collection = database.collection(PRODUCT_COLLECTION),
      result = await collection.insertOne(item)

    return result
  }
}

exports.handler = async function (event, context) {
  const { httpMethod, body } = event,
    item = JSON.parse(body)

  switch (httpMethod) {
    case 'POST':
      try {
        const result = await MenuDAO.createItem(item)

        return {
          statusCode: 200,
          body: JSON.stringify(result),
        }
      } catch (error) {
        console.error(error)
        return {
          statusCode: error.code === 11000 ? 409 : 500,
          body: JSON.stringify({
            error: error.toString(),
          }),
        }
      }
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'not found' }),
      }
  }
}
