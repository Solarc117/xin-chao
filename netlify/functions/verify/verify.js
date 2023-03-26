const jwt = require('jsonwebtoken')

exports.handler = async function ({ headers: { cookie } }) {
  const cookies = {}
  cookie.split(';').map(cookieString => {
    const [key, value] = cookieString.split('=')
    cookies[key] = value
  })
  const { jwt: token } = cookies

  if (typeof token !== 'string')
    return {
      statusCode: 401,
      body: 'Unauthorized',
    }

  return await jwt.verify(
    token,
    process.env.SESSION_SECRET,
    (error, { username }) => {
      return error || username !== process.env.ADMIN_USERNAME
        ? {
            statusCode: 403,
            body: 'Forbidden',
          }
        : {
            statusCode: 200,
            body: 'Allowed',
          }
    }
  )
}
