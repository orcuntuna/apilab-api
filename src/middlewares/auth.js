const jwt = require('jsonwebtoken')
require('dotenv/config')

const userModel = require('../models/User')

const verifyToken = (req, res, next) => {
  const token = req.headers['auth_token']
  if (typeof token !== 'undefined') {
    userModel.findOne({ token }, (err, data) => {
      if (err || !data) {
        res.status(403)
        res.json({
          success: false,
          error: 'Erişim reddedildi',
        })
      } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            res.status(403)
            res.json({
              success: false,
              error: 'Erişim reddedildi',
            })
          } else {
            req.next = decoded
            return next()
          }
        })
      }
    })
  } else {
    res.status(403)
    res.json({
      success: false,
      error: 'Erişim reddedildi',
    })
  }
}
