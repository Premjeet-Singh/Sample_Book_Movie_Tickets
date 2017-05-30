// api/services/mailer.js



module.exports.sendWelcomeMail = function(obj) {

	 sails.hooks.email.send(
		 'welcomeEmail', 
		 {
		 	// Name: obj.name,
		 	id: obj.id,
		 	email: obj.email,
		 	otp: obj.otp,
		 	host: obj.host
		 	// Name: "Test Name"
		 },
		 {
			 to: obj.email,
			 // from: 'prem@gmail.com',
			 // to: "itsprem2193@gmail.com",
			 subject: 'Invite Mail'
		 },
		 	function(err) {console.log(err || 'Mail Sent!');}
	 )
};


module.exports.sendPasswordForgotMail = function(obj) {

	 sails.hooks.email.send(
		 'passwordForgotMail', 
		 {
		 	// Name: obj.name,
		 	id: obj.id,
		 	email: obj.email,
		 	token: obj.token,
		 	host: obj.host
		 	// Name: "Test Name"
		 },
		 {
			 to: obj.email,
			 // from: 'prem@gmail.com',
			 // to: "itsprem2193@gmail.com",
			 subject: 'password Forgot Mail'
		 },
		 	function(err) {console.log(err || 'Mail Sent!');}
	 )
};

module.exports.sendTicketMail = function(obj) {

	 sails.hooks.email.send(
		 'sendTicketMail', 
		 {
		 	// Name: obj.name,
		 	data: obj
		 	// Name: "Test Name"
		 },
		 {
			 to: obj.email,
			 // from: 'prem@gmail.com',
			 // to: "itsprem2193@gmail.com",
			 subject: 'Booked Movie Ticket'
		 },
		 	function(err) {console.log(err || 'Mail Sent!');}
	 )
};