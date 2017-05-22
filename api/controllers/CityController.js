/**
 * CityController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// var otherSkills = req.body.otherSkills;
//     otherSkills = otherSkills.replace(/^[,\s]+|[,\s]+$/g, '');
//     otherSkills = otherSkills.replace(/\s*,\s*/g, ',');
// var otherSkillsArr = otherSkills.split(',');
	// typeCast internshipId to sails ObjectID					
var ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;


module.exports = {
// ===============================================================
// === Function to upload cinema in hall in particular city ==
// POST route /cinemaInHall
cinemaInHall: function(req, res){
	var city = req.body.city;
	var hall = req.body.hall;
	var time = req.body.time;
	var screen = req.body.screen;
	var movieName = req.body.movieName;
	var price = req.body.price;
	    price = price.replace(/^[,\s]+|[,\s]+$/g, '');
	    price = price.replace(/\s*,\s*/g, ',');
	 	price = price.split(',').map(Number);

var query = {time: time,
			screen: screen,
			movieName: movieName,
			price:price
		};

// for(var i=1; i < str.length; i++) {
//   query[str[i]] = [str[i]];        
// }

City.findOne({city: city, hall: hall}, function(err, movieExist){
	if(!movieExist){
		var arr=[];
		arr.push(query);
		City.create({city: city, hall: hall, movie:arr}, function(err, obj){
			if(!obj){
				res.send("SomeThing Went wrong in city and hall creation")
			} else {
				res.send("Movie Uploaded create")
			}
		})		
	} else {
		City.native(function (err, Collection){
			Collection.update({city:city,hall:hall},{ "$push": {'movie': query}}, {"upsert": true}, function (err, updated){
				console.log(updated)
			});  //  $push update closing
		});  // native method closing			
		res.send("Movie uploaded");
	}
})

},


// ==================================================
// === Function to add movie in Theater
addInSrs: function(req, res){
	var city = req.body.city;
	var time = req.body.time;
	var screen = req.body.screen;
	var movieName = req.body.movieName;
	var price = req.body.price;
	    price = price.replace(/^[,\s]+|[,\s]+$/g, '');
	    price = price.replace(/\s*,\s*/g, ',');
	var str = price.split(',').map(Number);

	var query = {
		time: time,
		screen: screen,
		movieName: movieName,
		price: str
	}
// update City collection with Movie Data
City.native(function (err, Collection){
	Collection.update({city: city},{ "$push": {'SRS Cinemas': query}}, {"upsert": true}, function (err, updated){
		console.log(updated)
	});  //  $push update closing
});  // native method closing	

	res.send(query);
},



};  // MODULE EXPORTS CLOSING ***********
// **************************************



// Fun Cinemas: Springcity, Carnival: JD High Street Mall, Eylex Cinemas: Hinoo,Plaza Cinema, Popkorn Cinemas: Galaxia Mall,PVR: Nucleus Mall,Sujata Picture Palace,SRS Cinemas