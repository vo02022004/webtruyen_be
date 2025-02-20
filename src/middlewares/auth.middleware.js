const JWT = require('jsonwebtoken')
const message = require('@root/message.js')
//============= AUTHORIZATION ===============//

const createHttpError = require('http-errors')

/** VERIFY ACCESS TOKEN
 * Xác minh tính hợp lệ của access token trong mỗi request
 * @param {Ojbect} res
 * @param {Object} req
 * @param {Object} next - gọi middleware kế tiếp
 */
function verifyAccessToken(req, res, next) {
  try {
    const JWT_INDEX = 1
    if (!req.headers['authorization']) {
      return next(createHttpError.Unauthorized(message.auth.missedToken))
    }
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader?.split(' ')
    const token = bearerToken[JWT_INDEX]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        switch (err) {
          case (err.name = 'TokenExpiredError'):
            return next(createHttpError.Unauthorized(message.auth.expiredToken))
          default:
            return next(createHttpError.Unauthorized(err.message))
        }
      }
      req.payload = payload
      next()
    })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  verifyAccessToken,
}
