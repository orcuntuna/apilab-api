const jwt = require('jsonwebtoken')
require('dotenv/config')

const userModel = require('../models/User')

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (typeof token !== 'undefined') {
    userModel.findOne({ token }, (err, user_data) => {
      if (err || !user_data) {
        res.status(403)
        res.json({
          success: false,
          error: 'Erişim reddedildi 3',
        })
      } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            res.status(403)
            res.json({
              success: false,
              error: 'Erişim reddedildi 2',
            })
          } else {
            req.next.user = user_data
            return next()
          }
        })
      }
    })
  } else {
    res.status(403)
    res.json({
      success: false,
      error: 'Erişim reddedildi 1',
    })
  }
}

module.exports = verifyToken