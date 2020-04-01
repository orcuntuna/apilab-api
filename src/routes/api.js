const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const router = express.Router()
const ProjectModel = require('../models/Project')
const ApiModel = require('../models/Api')
const authMiddleware = require('../middlewares/auth')

router.post('/:categoryId/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const category_id = req.params.categoryId
  ProjectModel.findOne(
    {
      owner: logged_in_user._id,
      'categories._id': category_id,
    },
    (err, project_data) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        if (!project_data) {
          res.json({
            success: false,
            error: 'Proje veya kategori bulunamadı.',
          })
        } else {
          let new_api = new ApiModel({
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            method: req.body.method,
            owner: logged_in_user._id,
            project_id: project_data._id,
            category_id: category_id,
          })
          new_api.save((err, api_data) => {
            if (err) {
              res.json({
                success: false,
                error: err,
              })
            } else {
              res.json({
                success: true,
                data: api_data,
              })
            }
          })
        }
      }
    },
  )
})

router.post('/:categoryId/update/:apiId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const category_id = req.params.categoryId
  const api_id = req.params.apiId
  ApiModel.findOneAndUpdate(
    {
      owner: logged_in_user,
      _id: api_id,
    },
    {
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
      method: req.body.method,
      order: req.body.order,
    },
    { runValidators: true, context: 'query', new: true },
    (err, api_data) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        res.json({
          success: true,
          data: api_data,
        })
      }
    },
  )
})

router.post('/:categoryId/delete/:apiId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const category_id = req.params.categoryId
  const api_id = req.params.apiId
  ApiModel.findOneAndDelete(
    {
      owner: logged_in_user,
      _id: api_id,
    },
    (err) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        res.json({
          success: true,
        })
      }
    },
  )
})

module.exports = router
