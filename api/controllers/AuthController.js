/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },


    login: function(req, res) {

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {          // get user data from passport.js returnUser variable
                if (err) res.send(err);
                // return res.send({
                //     message: info.message,
                //     user: user
                // });
            // ================================================
            // set required user's info to session
            req.session.passport.fname = user.fname;
            req.session.passport.lname = user.lname;
            req.session.passport.username = user.username;
            req.session.passport.type = user.type;
            req.session.passport.email = user.email;
            req.session.passport.phone = user.phone;

            // ================================================
            // set required user's info to cookie
            res.cookie('user', user, { expires: new Date(Date.now() + 60000), httpOnly: true, signed: true });

            // res.send(200,{data: req.session.passport});
            res.send(200,{data: user});

            });  // req.logIn closing

        })(req, res);   // passport.authenticate closing
    },   // login function closing

// ===Logout Function ======
// GET  route /logout
    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }



};   // module closing


