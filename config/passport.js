var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'val',
    passwordField: 'password'
  },
  function(val, password, done) {

// var num = parseInt(val);
  //  login by email or username or phone of user
    Users.findOne({ $or: [{ 'local.email': val }, { 'local.username': val }, { 'local.phone': parseInt(val) } ]}, function (err, user) {
    // Users.findOne({ 'local.email': email }, function (err, user) {        // login by email of user
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      // console.log("user info: ", user);

      bcrypt.compare(password, user.local.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          // Return 'returnUser' to AuthController Login function and store in session
          var returnUser = {
                id: user.id,
                name: user.local.name,
                username: user.local.username,
                email: user.local.email,
                phone: user.local.phone
            // createdAt: user.createdAt,
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
    });
  }
));



//           Users.validPassword(password, user, function(err, valid) {    //  check password authentication
//             if (err) {
//               return res.json(403, {err: 'forbidden'});        //  return 403 forbidden err msg
//             }

//             if (!valid) {
//               return res.json(401, {err: 'invalid username or password'});     //  // if password wrong  return 401 Unauthorised err msg
//             } else {
//               var tokenValue = sailsTokenAuth.issueToken({sid: user.id});

// // SET TOKEN IN COOKIE
// if(!req.signedCookies.token){
//   res.cookie('token', tokenValue, { expires: new Date(Date.now() + 300000), httpOnly: true, signed: true });   //  set token in cookie with expire time
// }

//               //  if user authenticated ... set session authentication to TRUE
//               req.session.authenticated = true;   //  2-12-2016                            
//               // res.view('dashboard', {user: user, token: tokenValue}); 
//               res.view('dashboard', {user: user, token: req.signedCookies.token });     //  render Dashboard Page and send 

//             }
//           });




          // ========================================

        //         bcrypt.compare(password, user.password, function (err, res) {
        //   if (!res)
        //     return done(null, false, {
        //       message: 'Invalid Password'
        //     });
        //   var returnUser = {
        //     email: user.email,
        //     createdAt: user.createdAt,
        //     id: user.id
        //   };
        //   return done(null, returnUser, {
        //     message: 'Logged In Successfully'
        //   });
        // });

                // =====================================