/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt');

// ==============================================
//======  hash function to encrypt password  ====
function hashPassword(arr, callback) {
bcrypt.genSalt(10, function(err, salt) {
 // if (err) return next(err);
bcrypt.hash(arr.password, 10, function(err, hash) {
    if (err) {
        // return next(err);
    }
    callback(hash);
});
});
}


function loginUser(user, req, res){

    req.logIn(user, function(err) {          // get user data from passport.js returnUser variable
            if (err) res.send(err);
            // return res.send({
            //     message: info.message,
            //     user: user
            // });
        // ================================================
        // set required user's info to session
        req.session.passport.name = user.local.name;
        req.session.passport.username = user.local.username;
        req.session.passport.email = user.local.email;
        req.session.passport.phone = user.local.phone;
        req.session.passport.type = user.local.type;

        // ================================================
        // set required user's info to cookie
        res.cookie('user', user, { expires: new Date(Date.now() + 60000), httpOnly: true, signed: true });

        // res.send(200,{data: req.session.passport});
        // res.send(200,{data: user});
        res.redirect('/',{user: req.session.passport})

        });  // req.logIn closing 

}

module.exports = {
//  dummy function ===========
	hi: function(req, res){
		res.send("This is hi function...!!!");
	},

//============================================================
//  FUNCTION TO REGISTER USER  ============================
// POST  route /register
  register: function(req, res){

      var arr = {password : req.body.password}

      // Password length validation
      if(arr.password.length<4){
        res.view('conflict',{password_length: arr.password.length, msg: "password should atleast 4 character long"});
        return;
      }

      //  first name, email, passowrd fields should not be empty
      if(!req.body.name || !req.body.email || !req.body.password){
          return res.view('conflict', {msg: 'username, email, type and password required'});
      } else {
            // check user-email already exist or not
              Users.findOne({'local.email':req.body.email}, function(err, useremail) {
                if (useremail) {
                  return res.view('conflict', {msg: 'User email already exist'});       // if user email exist return 409 conflict err
                } else {
                      // check username already exist or not
                        Users.findOne({'local.username':req.body.username}, function(err, username) {
                            if (username) {
                              return res.view('conflict', {msg: 'Username already exist'});       // if username exist return 409 conflict err
                            } else {
                                // check user phone already exist or not     
                                Users.findOne({'local.phone':req.body.phone}, function(err, userphone) {
                                    if (userphone) {
                                      return res.view('conflict', {msg: 'User Phone already exist'});       // if user phone no. exist return 409 conflict err
                                    } else {
                                             // hash function to encrypt password   
                                            hashPassword(arr, function(hash){     // calling hash function with password (arr) parameter
                                                  console.log("User password:"+ hash.length); 
  

  //  store user's data  in json object  'query'  ============              
  var query = {
        name : req.body.name, 
        username : req.body.username,               email : req.body.email, 
        password: hash,                             phone: parseInt(req.body.phone),
        type: req.body.type 
    };    // query closing

     console.log("Query: ", query)                                        
// res.send(query);
// User.create({local: {name : { fname : req.body.fname, lname : req.body.lname}, username : req.body.username, email : req.body.email, password: hash, type: req.body.type, phone: req.body.phone, verified: {mobile: false, email: false, address: false} }}, function(err, user){
                                                  Users.create({local: query}, function(err, user){      // create verified users account 
                                                    if(err){
                                                      if(err.ValidationError){
                                                        var e = validationError.determineError(query);
                                                        console.log("ValidationError ", e);
                                                        return res.view('conflict', {msg: e});
                                                      }
                                                      res.view('conflict', {msg: err});
                                                    } else {
loginUser(user, req, res);
                                                      // res.send(200, {msg: user});
                                                      // res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id})});      // generate token... No need here
                                                    }
                                                  });   // create closing 
                                            });    // hashPassword Closing

                                      
                                    }
                                });   //  userphone checking closing
                              
                            }
                        });   //  username checking closing

                }

    });   //  email checking closing

      }


  },   //   Register Closing


//=========   This login not works ... see AuthController Login function ===============
//  FUNCTION TO LOGIN AND AUTHENTICATE USER EMAIL AND PASSWORD  =========
login: function(req, res, next) {

    var email = req.param('email');
    var password = req.param('password');

    // email and password field should not be empty
    if (!email || !password) {
      return res.json(401, {err: 'username and password required'});
    }

    // User.findOneByEmail(email, function(err, user) {
    Users.findOne({'local.email':email}, function(err, user) {     //  check email exist or not
      if (!user) {
        return res.json(401, {err: 'invalid username or password'});      // if not exist return 401 Unauthorised err msg
      }

          Users.validPassword(password, user, function(err, valid) {    //  check password authentication
            if (err) {
              return res.json(403, {err: 'forbidden'});        //  return 403 forbidden err msg
            }

            if (!valid) {
              return res.json(401, {err: 'invalid username or password'});     //  // if password wrong  return 401 Unauthorised err msg
            } else {
              var tokenValue = sailsTokenAuth.issueToken({sid: user.id});

// SET TOKEN IN COOKIE
if(!req.signedCookies.token){
  res.cookie('token', tokenValue, { expires: new Date(Date.now() + 300000), httpOnly: true, signed: true });   //  set token in cookie with expire time
}

              //  if user authenticated ... set session authentication to TRUE
              req.session.authenticated = true;   //  2-12-2016                            
              // res.view('dashboard', {user: user, token: tokenValue}); 
              res.view('dashboard', {user: user, token: req.signedCookies.token });     //  render Dashboard Page and send 

            }
          });
    })
  },      //  CLOSING OF LOGIN FUNCTION


  //  ============================================================
  //    =======  Password Forgot Function ( Using Token) ======
  //  ============================================================

// POST  route /forgotpassword
    forgotpassword: function(req, res){
      var email = req.body.email;
          Users.findOne({'local.email': email},function(err, userObj){
              if(userObj){
                var token = sailsTokenAuth.issueToken({sid: userObj.id});
                // console.log(userObj);
                var expDate = Date.now() + 300000;

                //  set token and expiry time of token for changing password
                      Users.native(function (err, Collection){
                              Collection.update({'local.email': email},{$set: {resetPasswordToken:  token, resetPasswordExpires: expDate}}, {"upsert": true}, function(err, passObj){
                                    var user={ email: userObj.local.email, id: userObj.id, token: token, host: req.headers.host };
                                    // res.send(user);
                                    // console.log(req.headers.host);
                                    mailer.sendPasswordForgotMail(user);
                                    // res.json(200, {msg: "Email has been sent successfully" });
                                    res.view('ok', {msg: "Check your email to change password" });
                              });
                        });


              } else {
                // res.json({status:404});
                res.view('dataNotFound', {msg: 'Invalid email-id you have entered.'});
              }
              
          });

  },

// ==================================================================
// ==  Render newForgot password page with email, id, and token  ===
// GET route /reset/:email/:id/:token
    verifyforgot: function(req, res){
      var email = req.param('email');
      var id = req.param('id');
      var token = req.param('token');

      Users.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {      
        if (!user) {
          res.view('dataNotFound', {msg: "User Not Found Or token may has been expired"});
        } else {
            res.view('newForgot', {email: email, id: id, token: token});          
        }
      });

     
    },
// ====================================================================
//   Update password to database by verifying email, id and token  ===
// POST route /reset/:email/:id/:token
      verifyforgotp: function(req, res){
      var email = req.param('email');
      var id = req.param('id');
      var password = req.body.newPassword;
      var token = req.param('token');
      var arr = {password : password};

        Users.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            res.send("User Not Found Or May token has been expired");
          }

            hashPassword(arr, function(hash){
                  Users.update({resetPasswordToken: token, id: id}, {'local.password': hash, resetPasswordToken: undefined, resetPasswordExpires: undefined}, function (err, updated){
                      if(updated!=""){
                          res.send("  Password Changed Successfully...!!");

                      } else {
                        res.send("One Time Link has been Expired.. !!!...Try Again..!!!");
                      }
                });
            });
        });

  },

  //  ============================================================
  //    ==== End of Password Forgot Function ( Using Token) =====
  //  ============================================================

// ============ FETCH USERS INFORMATIONS =======================================

// ================================================================================================
// ======= Function to get users information with their id (populate with profileDetails) =======
// GET route /student/:id
student: function(req, res){
  var id = req.param('id');

  Users.findOne({id: id}).populate('profDetails').exec(function(err, student){
    if(!student){
      return res.json(404, {err: 'Not Found'});
    } else {
      res.send(student);
    }
  });  // findOne closing

}, // student function closing


// =====================  GLOBAL  ==========================================================
// GET route /global/student/:id   => id is userId
studentGlobal: function(req, res){
  // var id = '5850db4c8479d6880a7b386f';
  var id = req.param('id');

  // Users.findOne({id: id, select: ['local.name',] }).exec(function(err, student){ });  // it worls well  
 
   var query = Users.findOne({id: id}).populate('profDetails');
// call student function with query parameter
   student(query, function(student){
      if(student){
    // global json object stores name and currentStudy
        var json = {
          name: student.local.name.fname +' '+ student.local.name.lname,
          currentStudy: student.profDetails[0].currentStudy
        }
        res.send(json);
      } else {
        return res.send(404, {err: 'Not Found'});
      }
   });

},  // studentGlobal function closing




// =====================  EMPLOYER  ==========================================================
// GET route /employer/student/:id   => id is userId
studentEmployer: function(req, res){
  // var id = '5850db4c8479d6880a7b386f';
  var id = req.param('id');
   var query = Users.findOne({id: id}).populate('profDetails').populate('scores');
  // call student function with query parameter
   student(query, function(student){
      if(student){

        res.send(student);
      } else {
        return res.send(404, {err: 'Not Found'});
      }
   }); 


},  // studentGlobal function closing


// ============  LOGGED-IN   ===============================================
// GET route /loggedin/student/:id
studentLoggedIn: function(req, res){
    var id = req.param('id');
    var query = Users.findOne({id: id}).populate('profDetails').populate('scores');

      // call student function with query parameter
       student(query, function(student){
          if(student){
            var json = {
              name: student.local.name.fname +' '+ student.local.name.lname,
              currentStudy: student.profDetails[0].currentStudy,
              score: student.scores[0].score
            }
            res.send(json);
            // res.send(student);
          } else {
            return res.send(404, {err: 'Not Found'});
          }
       }); 


    // res.send('Logged In  '+ id);
},





// GET route  /logout
  // Logout Function...
  logout: function(req, res){

      res.clearCookie('token');
      req.session.authenticated = false;
      res.redirect('/login');
  },      //  Logout CLOSING



};   // module closing



function score(id, callback){

    Score.findOne({owner: id}, function(err, score){
      if(!student){
        callback(false);
      } else {
  // global object stores name and currentStudy
console.log(score);
        // callback(student);
      }
  });  // findOne closing

}

function student(query, callback){
// var data = Users.findOne({id: id}).populate('profDetails').populate('scores');
    // Users.findOne({id: id}).populate('profDetails').populate('scores').exec(function(err, student){
    query.exec(function(err, student){
      if(!student){
        callback(false);
      } else {
  // global object stores name and currentStudy

        callback(student);
      }
  });  // findOne closing

}