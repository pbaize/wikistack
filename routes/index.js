const express = require('express')
const router = express.Router()
const models = require('../models')
const Page = models.Page
const User = models.User

router.get('/', function (req, res, next) {
  Page.findAll()
    .then(function (contents) { res.render('index', {pages: contents}) })
})

module.exports = router
