const { MongoClient } = require('mongodb'),
  mongoClient = new MongoClient(process.env.URI),
  clientPromise = mongoClient.connect()

exports.handler = async function (event) {
  try {
    const database = (await clientPromise).db(process.env.DATABASE),
      collection = database.collection(process.env.COLLECTION),
      results = await collection.findOne({})

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}
