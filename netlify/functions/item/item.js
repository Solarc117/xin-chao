const { MongoClient } = require('mongodb'),
  { URI, DATABASE, PRODUCT_COLLECTION } = process.env,
  clientPromise = new MongoClient(URI, {
    appName: 'Xin Chao Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
    keepAlive: true,
  })

class MenuDAO {
  static async createItem(promise, item) {
    const database = (await promise).db(DATABASE),
      collection = database.collection(PRODUCT_COLLECTION),
      result = await collection.insertOne(item)

    // Not sure if I really need to await this - couldn't I just close the promise, & not wait for it to finish before returning the result?
    await promise.close()

    return result
  }

  static async updateItemById(promise, _id, newItem) {
    const database = (await promise).db(DATABASE),
      collection = database.collection(PRODUCT_COLLECTION),
      result = await collection.updateOne({ _id }, newItem)

    await promise.close()

    return result
  }
}

function handleErrorResponse(error) {
  console.error(error)

  return error.code === 121
    ? {
        statusCode: 400,
        body: JSON.stringify({
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
        }),
      }
    : {
        statusCode: error.code === 121 ? 409 : 500,
        body: JSON.stringify({
          error: error.toString(),
        }),
      }
}

exports.handler = async function (event, context) {
  const { httpMethod, body } = event,
    data = JSON.parse(body)

  switch (httpMethod) {
    case 'POST':
      if (!data instanceof Object)
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'body of invalid data type',
          }),
        }

      try {
        const result = await MenuDAO.createItem(clientPromise, data)

        return {
          statusCode:
            result.matchedCount === 1 && result.modifiedCount === 1 ? 200 : 500,
          body: JSON.stringify(result),
        }
      } catch (error) {
        handleErrorResponse(error)
      }
    case 'PATCH':
      const { id, item } = body
      if (typeof id !== 'string' || !item instanceof Object)
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'missing id or item properties',
          }),
        }

      try {
        const result = await MenuDAO.updateItemById(clientPromise, id, item)

        return {
          statusCode:
            result.matchedCount === 1 && result.modifiedCount === 1 ? 200 : 500,
          body: JSON.stringify(result),
        }
      } catch (error) {
        return handleErrorResponse(error)
      }
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'not found' }),
      }
  }
}
