const { MongoClient } = require('mongodb'),
  { URI, DATABASE, PRODUCT_COLLECTION } = process.env,
  mongoClient = new MongoClient(URI, {
    appName: 'Xin Chao Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  }),
  clientPromise = mongoClient.connect(),
  log = console.log.bind(console)

exports.handler = async function (event, context) {
  const { httpMethod } = event

  if (httpMethod !== 'GET')
    return {
      statusCode: 404,
      body: JSON.stringify({ clientError: 'not found' }),
    }

  try {
    const database = (await clientPromise).db(DATABASE),
      collection = database.collection(PRODUCT_COLLECTION),
      cursor = await collection.aggregate([
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
      ]),
      products = await cursor.toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(products),
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
