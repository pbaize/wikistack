const express = require('express')
const router = express.Router()
const models = require('../models')
const Page = models.Page
const User = models.User

router.get('/', function (req, res, next) {
  res.redirect('/')
})

router.post('/', function (req, res, next) {
  var tags = req.body.tags.replace(/\s/, '').split(',')
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
    .then(function (values) {
      var user = values[0]

      var page = Page.build({
        title: req.body.title,
        content: req.body.content,
        tags: tags
      })

      return page.save().then(function (page) {
        return page.setAuthor(user)
      })
    })
    .then(function (page) {
      res.redirect(page.route)
    })
    .catch(next)
})

router.get('/add', function (req, res, next) {
  res.render('addpage')
})

router.get('/:pageUrl', function (req, res, next) {
  var pageAndUser = []
  Page.findAll({
    where: {urlTitle: req.params.pageUrl}
  }).then(function (page) {
    pageAndUser.push(page[0].dataValues)
    return User.findAll({
      where: {id: pageAndUser[0].authorId}
    })
  }).then(function (userInfo) {
    pageAndUser.push(userInfo[0].dataValues)
    res.render('wikipage', {
      title: pageAndUser[0].title,
      content: pageAndUser[0].content,
      pageUrl: pageAndUser[0].urlTitle,
      userName: pageAndUser[1].name,
      userId: pageAndUser[1].id,
      tags: pageAndUser[0].tags
    })
  })
    .catch(next)
})

module.exports = router
