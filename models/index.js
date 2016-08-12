var Sequelize = require('Sequelize');
var db = new Sequelize('postgres://localhost/wikistack');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tag:{
        type:Sequelize.ARRAY(Sequelize.TEXT)
    }
    
},{
    hooks:{
        beforeValidate:function generateUrlTitle (page) {
                          if (page.title) {
                            // Removes all non-alphanumeric characters from title
                            // And make whitespace underscore
                           page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
                          } else {
                            // Generates random 5 letter string
                              page.urlTitle =  Math.random().toString(36).substring(2, 7);
                          }
                        }

        },
        getterMethods:{
            route:function(){
                return '/wiki/'+this.urlTitle;
            }
        }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};