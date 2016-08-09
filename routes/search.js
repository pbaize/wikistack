const express = require('express')
const router = express.Router()
const models = require('../models')
const Page = models.Page
const User = models.User

router.get('/', function (req, res, next) {
  if (req.query.tags) {
    var tags = req.query.tags.split(',').map(e => e.replace(/\s/g, ''))
    console.log(tags)
    Page.findByTag(tags)
      .then(function (contents) {
        pages = contents.map(function (element) { return element.dataValues})
        console.log(pages)
        console.log(contents)
        res.render('index', {pages: pages})
      })
  } else {
    res.render('tagsearch')
  }
})
// router.get('/', function (req, res, next) {})

module.exports = router
