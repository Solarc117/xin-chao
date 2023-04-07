const { MongoClient } = require('mongodb'),
  { URI, DATABASE, PRODUCT_COLLECTION } = process.env,
  mongoClient = new MongoClient(URI, {
    appName: 'Xin Chao Coffee',
    maxPoolSize: 1,
    maxIdleTimeMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 20_000,
  }),
  clientPromise = mongoClient.connect()

class ItemUpdater {
  static async handler(event, context) {
    const { httpMethod, body } = event

    console.log('httpMethod:', httpMethod)
    console.log('body:', body)

    // switch(httpMethod) {
    //   case 'GET':
    //     const result = await this.createItem()
    // }
  }

  // static createItem(item) {

  // }
}

exports.handler = ItemUpdater.handler