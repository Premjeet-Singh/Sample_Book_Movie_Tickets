//config/email.js


module.exports.email = {
	 service: 'Gmail',
	 auth: {
		 user: 'prem@sarasbyte.com', 
		 pass: 'hard2reach'
	 },
	 templateDir: 'api/emailTemplates',
	 // from: 'itsprem2193@gmail.com',
	 testMode: false,
	 ssl: true
}