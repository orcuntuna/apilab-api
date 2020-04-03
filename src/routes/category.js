const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const router = express.Router()
const ProjectModel = require('../models/Project')
const CategoryModel = require('../models/Category')
const authMiddleware = require('../middlewares/auth')

router.post('/:projectId/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const project_id = req.params.projectId
  ProjectModel.findOne(
    {
      _id: project_id,
      owner: logged_in_user._id,
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
            error: 'Proje mevcut değil',
          })
        } else {
          let new_category = new CategoryModel({
            name: req.body.name,
            owner: logged_in_user._id,
            project_id: project_id,
          })
          new_category.save((err, category_data) => {
            if (err) {
              res.json({
                success: false,
                error: err,
              })
            } else {
              project_data.categories_id.push(category_data._id)
              project_data.save((err, data) => {
                if (err) {
                  res.json({
                    success: false,
                    error: err,
                  })
                } else {
                  res.json({
                    success: true,
                    data: category_data,
                  })
                }
              })
            }
          })
        }
      }
    },
  )
})

router.post('/update/:categoryId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const category_id = req.params.categoryId
  CategoryModel.findOneAndUpdate(
    {
      owner: logged_in_user._id,
      _id: category_id,
    },
    {
      name: req.body.name,
      order: req.body.order,
    },
    {
      runValidators: true,
      context: 'query',
      new: true,
    },
    (err, updated_data) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        res.json({
          success: true,
          data: updated_data,
        })
      }
    },
  )
})

router.post('/delete/:categoryId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const project_id = null
  const category_id = req.params.categoryId
  ProjectModel.findOne(
    {
      'categories_id': category_id,
      owner: logged_in_user._id,
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
            error: 'Proje mevcut değil',
          })
        } else {
          CategoryModel.findOneAndDelete({
            _id: category_id,
            owner: logged_in_user._id,
          }, (err) => {
            if(err){
              res.json({
                success: false,
                error: err,
              })
            }else{
              project_data.categories_id.pull(category_id)
              project_data.save((err) => {
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
              })
            }
          })
        }
      }
    },
  )
})

module.exports = router
