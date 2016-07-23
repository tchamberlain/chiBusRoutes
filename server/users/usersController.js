var User = require( './users' );

module.exports = {
  getAllUsers: function() {},

  signin: function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  User.findOne({where: {username: username}})
    .then(function (user) {
      if (!user) {
        response.redirect('/signin');
      } else {
          
        }
    })
  },

  signup: function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    User.findOne({where: {username: username}})
      .then(function (user) {
        if (user) {
          response.send("username already exist, choose another username!");
        } else {
          User.create({
            username: username,
            password: password
          })
          .then(function (user) {
           
          });
        }
      })
  },

  validate: function (request, response) {
    var username = request.params.user;

    User.findOne({where: {username: username}})
      .then(function (user) {
        if (!user) {
          /* Please note that if $http is used then
          it is important that the server returns a
          success HTTP response code in order to
          fulfill the validation and a status level
          of 4xx in order to reject the validation.
          */
          response.send(400);
        } else {
          response.send(200);
        }
      })
    },

  signout: function() {}

};
