import fetch from 'node-fetch'
const { GOOGLE_KEY, PLACE_ID } = process.env

export async function handler(event, context) {
  const { httpMethod } = event
  if (httpMethod !== 'GET')
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'not found' }),
    }

  let response, result
  try {
    response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=opening_hours&key=${GOOGLE_KEY}`
    )
    result = await response.json()
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.toString()),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.result.opening_hours),
  }
}
