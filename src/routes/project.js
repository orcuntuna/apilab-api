const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const sha256 = require('crypto-js/sha256')
require('dotenv/config')
const router = express.Router()
const ProjectModel = require('../models/Project')
const authMiddleware = require('../middlewares/auth')

router.get('/list', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  ProjectModel.aggregate(
    [
      {
        $match: {
          owner: mongoose.Types.ObjectId(logged_in_user._id),
        },
      },
      {
        $project: {
          name: true,
          type: true,
          description: true,
        },
      },
    ],
    (err, projects_data) => {
      if (err) {
        res.json({
          success: false,
          message: 'Proje listeli alınamadı.',
        })
      } else {
        res.json({
          success: true,
          data: projects_data,
        })
      }
    },
  )
})

router.post('/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const new_project = new ProjectModel({
    owner: logged_in_user._id,
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
  })
  if (
    req.body.type === 'public' ||
    (req.body.type === 'private' && logged_in_user.rank === 'premium')
  ) {
    new_project.save((err, data) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        res.json({
          success: true,
          data: data,
        })
      }
    })
  } else {
    let err_msg = ''
    if (req.body.type === 'public' || req.body.type === 'private') {
      err_msg = 'Private proje oluşturmak için premium üye olmalısınız.'
    } else {
      err_msg = 'Proje tipi sadece public veya private olabilir.'
    }
    res.json({
      success: false,
      error: {
        errors: {
          type: {
            message: err_msg,
          },
        },
      },
    })
  }
})

module.exports = router
