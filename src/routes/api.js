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

router.post('/update/:apiId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
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

router.post('/delete/:apiId', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
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

router.post('/:apiId/header_params/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const api_id = req.params.apiId
  ApiModel.findOneAndUpdate(
    {
      _id: api_id,
      owner: logged_in_user._id,
    },
    {
      $push: {
        header_params: {
          key: req.body.key,
          value: req.body.value,
          type: req.body.type,
        },
      },
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
          data: updated_data.header_params,
        })
      }
    },
  )
})

router.post(
  '/:apiId/header_params/update/:headerParamsId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const api_id = req.params.apiId
    const header_params_id = req.params.headerParamsId
    ApiModel.findOneAndUpdate(
      {
        _id: api_id,
        owner: logged_in_user._id,
        'header_params._id': header_params_id,
      },
      {
        $set: {
          'header_params.$.key': req.body.key,
          'header_params.$.value': req.body.value,
          'header_params.$.type': req.body.type,
        },
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
            data: updated_data.header_params,
          })
        }
      },
    )
  },
)

router.post(
  '/:apiId/header_params/delete/:headerParamsId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const api_id = req.params.apiId
    const header_params_id = req.params.headerParamsId
    ApiModel.findOneAndUpdate(
      {
        _id: api_id,
        owner: logged_in_user._id,
        'header_params._id': header_params_id,
      },
      {
        $pull: {
          header_params: {
            _id: header_params_id,
          },
        },
      },
      (err) => {
        if (err) {
          res.json({
            success: false,
          })
        } else {
          res.json({
            success: true
          })
        }
      },
    )
  },
)

router.post('/:apiId/url_params/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const api_id = req.params.apiId
  ApiModel.findOneAndUpdate(
    {
      _id: api_id,
      owner: logged_in_user._id,
    },
    {
      $push: {
        url_params: {
          key: req.body.key,
          value: req.body.value,
          type: req.body.type,
        },
      },
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
          data: updated_data.url_params,
        })
      }
    },
  )
})

router.post(
  '/:apiId/url_params/update/:urlParamsId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const api_id = req.params.apiId
    const url_params_id = req.params.urlParamsId
    ApiModel.findOneAndUpdate(
      {
        _id: api_id,
        owner: logged_in_user._id,
        'url_params._id': url_params_id,
      },
      {
        $set: {
          'url_params.$.key': req.body.key,
          'url_params.$.value': req.body.value,
          'url_params.$.type': req.body.type,
        },
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
            data: updated_data.url_params,
          })
        }
      },
    )
  },
)

router.post(
  '/:apiId/url_params/delete/:urlParamsId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const api_id = req.params.apiId
    const url_params_id = req.params.urlParamsId
    ApiModel.findOneAndUpdate(
      {
        _id: api_id,
        owner: logged_in_user._id,
        'url_params._id': url_params_id,
      },
      {
        $pull: {
          url_params: {
            _id: url_params_id,
          },
        },
      },
      (err) => {
        if (err) {
          res.json({
            success: false,
          })
        } else {
          res.json({
            success: true
          })
        }
      },
    )
  },
)

router.post('/:apiId/data_params/add', authMiddleware, (req, res) => {
  const logged_in_user = req.next.user
  const api_id = req.params.apiId
  ApiModel.findOneAndUpdate(
    {
      _id: api_id,
      owner: logged_in_user._id,
    },
    {
      $push: {
        data_params: {
          key: req.body.key,
          value: req.body.value,
          type: req.body.type,
        },
      },
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
          data: updated_data.data_params,
        })
      }
    },
  )
})

router.post(
  '/:apiId/data_params/update/:dataParamsId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const api_id = req.params.apiId
    const data_params_id = req.params.dataParamsId
    ApiModel.findOneAndUpdate(
      {
        _id: api_id,
        owner: logged_in_user._id,
        'data_params._id': data_params_id,
      },
      {
        $set: {
          'data_params.$.key': req.body.key,
          'data_params.$.value': req.body.value,
          'data_params.$.type': req.body.type,
        },
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
            data: updated_data.data_params,
          })
        }
      },
    )
  },
)

router.post(
  '/:apiId/data_params/delete/:dataParamsId',
  authMiddleware,
  (req, res) => {
    const logged_in_user = req.next.user
    const api_id = req.params.apiId
    const data_params_id = req.params.dataParamsId
    ApiModel.findOneAndUpdate(
      {
        _id: api_id,
        owner: logged_in_user._id,
        'data_params._id': data_params_id,
      },
      {
        $pull: {
          data_params: {
            _id: data_params_id,
          },
        },
      },
      (err) => {
        if (err) {
          res.json({
            success: false,
          })
        } else {
          res.json({
            success: true
          })
        }
      },
    )
  },
)


module.exports = router
