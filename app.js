'use strict'
require('babel-register')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const swig = require('swig')
const routes = require('./routes')
const path = require('path')

const app = express()

app.engine('html', swig.renderFile) // how to render html templates
app.set('view engine', 'html') // what file extension do our templates have
app.set('views', path.join(__dirname, '/views')) // where to find the views
swig.setDefaults({ cache: false })

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.listen(1337)
app.use(routes)
