module.exports.determineError = function(query, req) {
	console.log(query);
	if(!query.name.match(/^[a-zA-Z ]{3,30}$/)){

		return 'name should be string';

	} else if(!query.username.match(/^(?=.*[a-z])[a-z\-]{6,25}$/)){

		return "username should atleast 6 character long and it may conatins only '\-' in special character";

	} else if(!query.password.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%\/^.&*])[a-zA-Z0-9!@\/#$%.^&*]{8,100}$/)){

		return 'password should atleast 8 character long';

	} else if(!query.email.match(/^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/)){

		return 'email should be email type';
	
	} 
	// else if(!query.phone.match(/^[7-9]{1}[0-9]{9}$/)){

	// 	return 'Phone number should starts from 9 or 8 or 7 and 10 digit long';
	
	// }
};



  // //  store user's data  in json object  'query'  ============              
  // var query = {
  //       name : { fname : req.body.fname,            lname : req.body.lname }, 
  //       username : req.body.username,               email : req.body.email, 
  //       password: hash,                             dob: req.body.dob, 
  //       phone: req.body.phone,                      type: req.body.type,                      gender: req.body.gender,
  //       verified: { mobile: false, email: false, address: false } 
  //   };    // query closing