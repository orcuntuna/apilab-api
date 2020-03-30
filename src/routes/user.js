const express = require('express')
const jwt = require('jsonwebtoken')
const sha256 = require('crypto-js/sha256')
require('dotenv/config')
const router = express.Router()
const UserModel = require('../models/User')

router.post('/register', (req, res) => {
  console.log(
    sha256(req.body.password + process.env.PASSWORD_HASH_KEY).toString(),
  )
  const user = new UserModel({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    username: req.body.username,
    password: sha256(
      req.body.password + process.env.PASSWORD_HASH_KEY,
    ).toString(),
  })
  user.save((err, data) => {
    if (err) {
      res.json({
        success: false,
        error: err,
      })
    } else {
      let jwt_user_data = {
        _id: data._id,
        name: data.name,
        surname: data.surname,
        email: data.email,
        username: data.username,
        rank: data.rank,
      }
      jwt.sign(
        { user: jwt_user_data },
        process.env.JWT_SECRET_KEY,
        (err, token) => {
          user.token = token
          jwt_user_data.token = token
          user.save((err, save) => {
            res.json({
              success: true,
              data: jwt_user_data,
            })
          })
        },
      )
    }
  })
})

router.post('/login', (req, res) => {
  UserModel.findOne(
    {
      $or: [
        {
          email: req.body.email,
        },
        {
          username: req.body.email,
        },
      ],
      $and: [
        {
          password: sha256(
            req.body.password + process.env.PASSWORD_HASH_KEY,
          ).toString(),
        },
      ],
    },
    (err, user) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        if (!user) {
          res.json({
            success: false,
            error: 'Giriş bilgileri hatalı.',
          })
        } else {
          let jwt_user_data = {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            rank: user.rank,
          }
          jwt.sign(
            { user: jwt_user_data },
            process.env.JWT_SECRET_KEY,
            (err, token) => {
              user.token = token
              jwt_user_data.token = token
              user.save((err, save) => {
                res.json({
                  success: true,
                  data: jwt_user_data,
                })
              })
            },
          )
        }
      }
    },
  )
})

module.exports = router
