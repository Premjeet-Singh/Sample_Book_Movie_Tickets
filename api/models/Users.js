/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    local:                      { type: 'json' },
    resetPasswordToken:         { type: 'string' },
    resetPasswordExpires:       { type: 'date' },
  	bought:                     { collection: 'bought', via: 'owner' },
  },   //  attributes closing





// Check for valid password
    validPassword: function(password, user, cb) {
    bcrypt.compare(password, user.local.password, function(err, match) {
      if (err) cb(err);

      if (match) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  },






};


// ====================================================================
// ============ Validation error Structure  =====================

// {
//   "error": "E_VALIDATION",
//   "status": 400,
//   "summary": "1 attribute is invalid",
//   "model": "Users",
//   "invalidAttributes": {
//     "local": [
//       {
//         "rule": "local",
//         "message": "\"local\" validation rule failed for input: { name: { fname: 'mahesh2', lname: 'kumar' },\n  username: 'maheshkumar',\n  email: 'mahesh@gmail.com',\n  password: '$2a$10$4AOgC13cV4XFRrP9Y5szduPxRiHu.hMbI9RZtCLZJ9HrNehKvXRM.',\n  dob: '1 jan 1990',\n  phone: '9988776678',\n  type: 'stu',\n  gender: 'm',\n  verified: { mobile: false, email: false, address: false } }\nSpecifically, it threw an error.  Details:\n undefined"
//       }
//     ]
//   }
// }