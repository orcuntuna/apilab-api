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

module.exports = router
