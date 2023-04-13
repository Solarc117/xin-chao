const { MongoClient, ObjectId } = require('mongodb'),
  { URI, DATABASE, PRODUCT_COLLECTION } = process.env,
  clientPromise = new MongoClient(URI, {
    appName: 'Xin Chào Coffee',
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

    await promise.close()

    return result
  }

  static async updateItemById(promise, _id, newItem) {
    const database = (await promise).db(DATABASE),
      collection = database.collection(PRODUCT_COLLECTION),
      result = await collection.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: newItem,
        },
        { returnDocument: 'after' }
      )

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
        const result = await MenuDAO.createItem(clientPromise, data),
          { acknowledged, insertedId } = result

        return {
          statusCode: acknowledged && insertedId ? 200 : 500,
          body: JSON.stringify(result),
        }
      } catch (error) {
        handleErrorResponse(error)
      }
    case 'PATCH':
      const { id, item } = data
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
            result.ok === 1 && result.value instanceof Object ? 200 : 500,
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
