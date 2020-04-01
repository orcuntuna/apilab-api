const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
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

router.post('/delete/:projectId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const project_id = req.params.projectId
  ProjectModel.findOneAndDelete(
    {
      _id: project_id,
      owner: logged_in_user._id,
    },
    (err) => {
      if (err) {
        res.json({
          success: false,
          error: 'Proje silinemedi.',
        })
      } else {
        res.json({
          success: true,
        })
      }
    },
  )
})

router.post('/update/:projectId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const project_id = req.params.projectId
  if (req.body.type === 'private' && logged_in_user.rank !== 'premium') {
    res.json({
      success: false,
      error: 'Projeyi private yapmak için premium üyelik gereklidir.',
    })
  } else {
    ProjectModel.findOneAndUpdate(
      {
        _id: project_id,
        owner: logged_in_user._id,
      },
      {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
      },
      { runValidators: true, context: 'query' },
      (err, data) => {
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
  }
})

router.get('/:projectId', authMiddleware, (req, res) => {
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
            error: 'Proje bulunamadı.',
          })
        } else {
          res.json({
            success: true,
            data: project_data,
          })
        }
      }
    },
  )
})

router.post('/:projectId/categories/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const project_id = req.params.projectId
  ProjectModel.findOneAndUpdate(
    {
      _id: project_id,
      owner: logged_in_user._id,
    },
    {
      $push: {
        categories: {
          name: req.body.name,
        },
      },
    },
    { runValidators: true, context: 'query', new: true },
    (err, updated_data) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        })
      } else {
        res.json({
          success: true,
          data: updated_data.categories,
        })
      }
    },
  )
})

router.post(
  '/:projectId/categories/update/:categoryId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const project_id = req.params.projectId
    const category_id = req.params.categoryId
    ProjectModel.findOneAndUpdate(
      {
        _id: project_id,
        owner: logged_in_user._id,
        'categories._id': category_id,
      },
      {
        $set: {
          'categories.$.name': req.body.name,
          'categories.$.order': req.body.order,
        },
      },
      { runValidators: true, context: 'query', new: true },
      (err, updated_data) => {
        if (err) {
          res.json({
            success: false,
            error: err,
          })
        } else {
          res.json({
            success: true,
            data: updated_data.categories,
          })
        }
      },
    )
  },
)

router.post(
  '/:projectId/categories/delete/:categoryId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const project_id = req.params.projectId
    const category_id = req.params.categoryId
    ProjectModel.findOneAndUpdate(
      {
        _id: project_id,
        owner: logged_in_user._id,
        'categories._id': category_id,
      },
      { $pull: { categories: { _id: category_id } } },
      { runValidators: true, context: 'query', new: true },
      (err, updated_data) => {
        if (err) {
          res.json({
            success: false,
            error: err,
          })
        } else {
          res.json({
            success: true,
            data: updated_data.categories,
          })
        }
      },
    )
  },
)

router.post('/:projectId/apis/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const project_id = req.params.projectId
  const category_id = req.params.categoryIds
})

module.exports = router
