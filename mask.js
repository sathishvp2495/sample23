const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb://localhost:27017' // Replace with your MongoDB connection URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

function getRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}

function getRandomDate() {
  const startDate = new Date(2000, 0, 1) // Change to your desired start date
  const endDate = new Date() // Current date and time
  const randomTimestamp =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime())
  return new Date(randomTimestamp)
}

async function updateDocumentsInCollection(collection) {
  const updateResult = await collection.updateMany(
    {},
    {
      $set: {
        firstName: getRandomString(10),
        lastName: getRandomString(10),
        startDate: getRandomDate(),
        endDate: getRandomDate(),
      },
    }
  )

  console.log(
    `${updateResult.modifiedCount} documents updated in collection ${collection.collectionName}`
  )
}

async function updateAllCollections() {
  try {
    await client.connect()
    console.log('Connected to the database')

    const database = client.db('Masking_DB') // Replace with your database name
    const collections = await database.listCollections().toArray()

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name
      const collection = database.collection(collectionName)
      await updateDocumentsInCollection(collection)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    client.close()
    console.log('Connection closed')
  }
}

updateAllCollections()
