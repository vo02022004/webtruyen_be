//=======================================================
//                    JSON WEB TOKEN
//=======================================================
const JWT = require('jsonwebtoken')

// GENERATE AN ACCESS TOKEN
/** Trả về 1 cho client 1 access token được ký bằng ACCESS_TOKEN_SECRET
 *  @param {number} userId - Id người dùng
 *  @returns {Promise}
 */
const signAccessToken = (userId, roleId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
      roleId,
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET
    const option = {
      //30 minutes
      expiresIn: '25m',
    }
    JWT.sign(payload, secretKey, option, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}

// GENERATE A REFRESH TOKEN
/** Trả về 1 cho client 1 access token được ký bằng REFRESH_TOKEN_SECRET
 *  @param {number} userId - Id người dùng
 *  @returns {Promise}
 */
const signRefreshToken = (useId, roleId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      useId,
      roleId,
    }
    const secretKey = process.env.REFRESH_TOKEN_SECRET
    const option = {
      expiresIn: '14d',
    }
    JWT.sign(payload, secretKey, option, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}

// VERIFY A REFRESH TOKEN TO CREAT A NEW PAIR
/** Xác minh tính chính hợp lệ của refresh-token
 *  @param {number} userId - Id người dùng
 *  @returns {Promise}
 */
function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) reject(err)
        resolve(payload)
      },
    )
  })
}
module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}
