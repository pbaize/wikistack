const express = require('express')
const router = express.Router()
const models = require('../models')
const Page = models.Page
const User = models.User

router.get('/', function (req, res, next) {
  User.findAll()
    .then(function (contents) { res.render('userlist', {users: contents}) })
})

router.get('/:id', function (req, res, next) {
  var userP = User.findAll({
    where: {id: req.params.id}
  })
  var pageP = Page.findAll({where: {authorId: req.params.id}})
  Promise.all([userP, pageP])
    .then(function (content) {
      var pageContent = content[1]
      var userContent = content[0][0].dataValues
      console.log(userContent)
      res.render('userpage', {
        pages: pageContent,
        userName: userContent.name,
        email: userContent.email
      })
    }).catch(next)
})

module.exports = router
