
import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config()

console.log('typeof MongoClient:', typeof MongoClient)
console.log('typeof ObjectId:', typeof ObjectId)

//
;(async () => {
  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  console.log('connected to db :)')

  try {
    await client.connect()
  } catch (error) {
    console.error(error)
  }
})()
