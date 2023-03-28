const { MongoClient } = require('mongodb'),
  mongoClient = new MongoClient(process.env.URI),
  clientPromise = mongoClient.connect()

exports.handler = async function (event, context) {
  const { httpMethod } = event

  if (httpMethod !== 'GET')
    return {
      statusCode: 404,
      body: JSON.stringify({ clientError: '404 not found' }),
    }

  try {
    const database = (await clientPromise).db(process.env.DATABASE),
      collection = database.collection(process.env.PRODUCT_COLLECTION),
      cursor = await collection.aggregate([
        {
          $group: {
            _id: '$category',
            products: { $push: '$$ROOT' },
          },
        },
        {
          $addFields: {
            'category': '$_id',
          },
        },
        {
          $project: {
            _id: 0,
            'products._id': 0,
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
