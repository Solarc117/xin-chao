function validateObject(obj) {
  const schema = {
    bsonType: 'object',
    required: ['name', 'category', 'price'],
    properties: {
      name: {
        bsonType: 'string',
      },
      description: {
        bsonType: 'string',
      },
      category: {
        bsonType: 'string',
      },
      price: {
        anyOf: [
          {
            bsonType: 'object',
          },
          {
            bsonType: 'string',
          },
        ],
      },
      temperature: {
        bsonType: 'array',
      },
    },
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) return false

  for (const prop of schema.required)
    if (!obj.hasOwnProperty(prop)) return false

  for (const prop in obj) {
    const value = obj[prop]
    const propSchema = schema.properties[prop]

    if (!propSchema) return false

    if (propSchema.bsonType === 'string' && typeof value !== 'string')
      return false

    if (propSchema.bsonType === 'array' && !Array.isArray(value)) return false

    if (
      propSchema.anyOf &&
      !propSchema.anyOf.some(
        option =>
          (option.bsonType === 'object' &&
            typeof value === 'object' &&
            !Array.isArray(value)) ||
          (option.bsonType === 'string' && typeof value === 'string')
      )
    )
      return false
  }

  return true
}
