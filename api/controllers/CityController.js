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
module.exports = {
// ===============================================================
// === Function to upload cinema hall list in particular city ==
// POST route /hallincity
hallInCity: function(req, res){
	var city = req.body.city;
	var hall = req.body.hall;
	    hall = hall.replace(/^[,\s]+|[,\s]+$/g, '');
	    hall = hall.replace(/\s*,\s*/g, ',');
	var str = hall.split(',');
var query = {};
query.city = city;
for(var i=1; i < str.length; i++) {
  query[str[i]] = {};        
};

	// res.send(query)
	City.create(query, function(err, obj){
		if(!obj){
			res.send("SomeThing Went wrong in city and hall creation")
		} else {
			res.send(obj)
		}
	})
},


};  // MODULE EXPORTS CLOSING ***********
// **************************************



// Fun Cinemas: Springcity, Carnival: JD High Street Mall, Eylex Cinemas: Hinoo,Plaza Cinema, Popkorn Cinemas: Galaxia Mall,PVR: Nucleus Mall,Sujata Picture Palace,SRS Cinemas