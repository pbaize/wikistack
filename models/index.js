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
  status: Sequelize.BOOLEAN,
  tags: Sequelize.ARRAY(Sequelize.STRING)
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

Page.belongsTo(User, { as: 'author' })

Page.findByTag = function (tags) {
  return Page.findAll({
    // $overlap matches a set of possibilities
    where: {
      tags: {
        $overlap: tags
      }
    }
  })
}

Page.findSimilar = function () {
  console.log(this)
}

// const Tag = db.define('tag', {

// })

module.exports = {
  Page: Page,
  User: User
}
