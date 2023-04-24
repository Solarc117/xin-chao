import jwt from 'jsonwebtoken'
import { MongoClient, ObjectId } from 'mongodb'

const { URI, DATABASE, PRODUCT_COLLECTION, SESSION_SECRET, ADMIN_USERNAME } =
  process.env,
  client = new MongoClient(URI, {
    appName: 'Xin Chào Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  })

class MenuDAO {
  /**
   * @param {Object} event - The AWS Lambda event object.
   * @param {Object} event.headers - The HTTP headers of the request.
   * @param {string} event.httpMethod - The HTTP method of the request.
   * @param {string} event.body - The body of the request.
   * @param {MongoClient} client The MongoClient promise.
   */
  constructor(event, client) {
    const { headers, httpMethod, body } = event

    this.headers = headers
    this.httpMethod = httpMethod
    this.body = body
    this.client = client
  }

  /**
   * Ensures request is paird with a valid json web token.
   * @returns {Promise<boolean>} An indicator of whether the client token could be authenticated or not.
   */
  async #authenticate() {
    const { cookie } = this.headers

    if (typeof cookie !== 'string') return false

    const cookies = {}
    cookie.split(';').map(cookieString => {
      const [key, value] = cookieString.split('=')
      cookies[key] = value
    })
    const { jwt: token } = cookies

    return typeof token !== 'string'
      ? false
      : await jwt.verify(token, SESSION_SECRET, (error, user) => {
        if (error) {
          console.error(error)
          return false
        }

        return user === undefined || user.username !== ADMIN_USERNAME
          ? false
          : true
      })
  }

  /**
   * Adds a new product to the database.
   * @param {Product} product
   * @returns {Promise< Error | import('mongodb').InsertOneResult<Document> >}
   */
  async createProduct(product) {
    if (!(await this.#authenticate()))
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      }

    try {
      await this.client.connect()

      const database = this.client.db(DATABASE),
        collection = database.collection(PRODUCT_COLLECTION),
        result = await collection.insertOne(product)

      await this.client.close()

      return result
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Updates a product in the database by its id.
   * @param {string} _id The id of the item to update.
   * @param {Product} newProduct The new data for the product.
   * @returns {Promise< Error | Product >} The result of the update operation.
   */
  async updateProductById(_id, newProduct) {
    if (!(await this.#authenticate()))
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      }

    try {
      await this.client.connect()

      const database = this.client.db(DATABASE),
        collection = database.collection(PRODUCT_COLLECTION),
        result = await collection.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          {
            $set: newProduct,
          },
          { returnDocument: 'after' }
        )

      await this.client.close()

      return result
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Deletes a product from the database by its id.
   * @param {string} _id The id of the product to delete.
   * @returns {Promise< Error | import('mongodb').DeleteResult >} The result of the delete operation.
   */
  async deleteProductById(_id) {
    if (!(await this.#authenticate()))
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      }

    try {
      await this.client.connect()

      const database = this.client.db(DATABASE),
        collection = database.collection(PRODUCT_COLLECTION),
        result = await collection.deleteOne({ _id: new ObjectId(_id) })

      await this.client.close()

      return result
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

export async function handler(event, context) {
  const { httpMethod, body } = event,
    data = JSON.parse(body),
    dao = new MenuDAO(event, client)

  switch (httpMethod) {
    case 'POST': {
      console.log('data:', data)
      if (!data.name instanceof Object)
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'body of invalid data type',
          }),
        }

      const result = await dao.createProduct(data)
      if (result instanceof Error)
        return {
          statusCode: error.code === 121 ? 409 : 500,
          body: JSON.stringify({
            error: error.toString(),
          }),
        }

      const { acknowledged, insertedId } = result
      return {
        statusCode: acknowledged && insertedId ? 200 : 500,
        body: JSON.stringify(result),
      }
    }
    case 'PATCH': {
      const { id, item } = data
      if (typeof id !== 'string' || !(item instanceof Object))
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'missing id or item properties',
          }),
        }

      const result = await dao.updateProductById(id, item)

      return {
        statusCode:
          result.ok === 1 && result.value instanceof Object ? 200 : 500,
        body: JSON.stringify(result),
      }
    }
    case 'DELETE': {
      const { id } = data
      if (typeof id !== 'string')
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'missing id or item properties',
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
