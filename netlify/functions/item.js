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

          return user !== void 0 && user.username === ADMIN_USERNAME
        })
  }

  /**
   * Adds a new product to the database.
   * @param {Product} product
   * @returns {Promise< Error | import('mongodb').InsertOneResult<Document> >}
   */
  async createProduct(product) {
    if (!(await this.#authenticate())) {
      const error = new Error('Unauthorized')
      error.code = 401
      return error
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
      if (this.client) await this.client.close()
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
    if (!(await this.#authenticate())) {
      const error = new Error('Unauthorized')
      error.code = 401
      return error
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
      if (this.client) await this.client.close()
      return error
    }
  }

  /**
   * Deletes a product from the database by its id.
   * @param {string} _id The id of the product to delete.
   * @returns {Promise< Error | import('mongodb').DeleteResult >} The result of the delete operation.
   */
  async deleteProductById(_id) {
    if (!(await this.#authenticate())) {
      const error = new Error('Unauthorized')
      error.code = 401
      return error
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
      if (this.client) await this.client.close()
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
      const { item } = data
      if (!(item instanceof Object))
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'body item of invalid data type',
          }),
        }

      const result = await dao.createProduct(item)
      if (result instanceof Error) {
        const { code } = result
        if (code === 121)
          console.error(
            'Document failed validation - rules not satisfied:',
            result.errInfo.details.schemaRulesNotSatisfied
          )

        return {
          statusCode: code === 121 ? 409 : code === 401 ? 401 : 500,
          body: JSON.stringify({
            error: result.toString(),
          }),
        }
      }

      const { acknowledged, insertedId } = result
      return {
        statusCode: acknowledged && insertedId ? 200 : 500,
        body: JSON.stringify(result),
      }
    }
    case 'PATCH': {
      const { _id, item } = data
      if (typeof _id !== 'string' || !(item instanceof Object))
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'missing id or item properties',
          }),
        }

      const result = await dao.updateProductById(_id, item)

      return result instanceof Error
        ? {
            statusCode: result.code === 121 ? 409 : 500,
            body: JSON.stringify({ error: result.toString() }),
          }
        : {
            statusCode: 200,
            body: JSON.stringify(result),
          }
    }
    case 'DELETE': {
      const { _id } = data
      if (typeof _id !== 'string')
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'missing id or item properties',
          }),
        }

      const result = await dao.deleteProductById(_id)

      return result instanceof Error
        ? {
            statusCode: result.code || 500,
            body: JSON.stringify({ error: result.toString() }),
          }
        : {
            statusCode: 200,
            body: JSON.stringify(result),
          }
    }
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'not found' }),
      }
  }
}
