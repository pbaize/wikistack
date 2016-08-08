const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
})
const UrlSafeString = require('url-safe-string')
const tagGenerator = new UrlSafeString()

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'unnamedPage'
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: Sequelize.BOOLEAN
}, {
  getterMethods: {
    route: function () {
      return '/wiki/' + this.urlTitle
    }
  }
})

Page.hook('beforeValidate', function (page, options) {
  page.urlTitle = page.title === '' ? Math.random().toString(36).substring(7) : tagGenerator.generate(page.title)
})

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    isEmail: true
  }
})

module.exports = {
  Page: Page,
  User: User
}
