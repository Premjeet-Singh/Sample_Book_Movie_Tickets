/**
 * MovieController
 *
 * @description :: Server-side logic for managing movies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
// =====================================================
// === Function to Upload Movie details ============
movieUpload: function(req, res){
var name= req.body.name;
var language= req.body.language;
var type= req.body.type;
var dimension= req.body.dimension;
var releaseDate= req.body.releaseDate;
var runTime= req.body.runTime;
var director= req.body.director;
var genre= req.body.genre;
var cast= req.body.cast;
var synopsis= req.body.synopsis;
var city= req.body.city;
var result = city.replace (/[, ]+/g, " ").trim();
var str=result.split(" ");

var query = {
	name:name, language:language, type:type,
	dimension:dimension, releaseDate:releaseDate, runTime:runTime,
	director:director, genre:genre, cast:cast,
	synopsis:synopsis, city:str, status:'open',
}
Movie.findOne({name: name}, function(err, movie){
	if(!movie){
		Movie.create(query, function(err, obj){
			if(!obj){
				res.send("something went wrong");
			} else {
				res.send(obj)
			}
		})
	} else {
		res.send("Movie already exist")
	}
})


// res.send(query);
},


// ==================================================================
// === Function to get list of all movies ========================
// GET route /movie
movieList: function(req, res){
	Movie.find({}, function(err, obj){
		if(obj==''){
			res.send("Movies not found")
		} else {
			var name = [];
			// var name = obj[0].name.split(" ")[0];
			for(var i=0; i<obj.length;i++){
				name.push(obj[i].name.split(" ")[0])
			}
			console.log(name)

			// res.send(obj);
			res.view("page/movie",{data: obj, name: name})
		}
	})
},


// =================================================================
// ==== Function to get particular movie detail ===========
// GET route /movie/:name
movieParticular: function(req, res){
	var name = req.param('name');        // name is movie name
	Movie.findOne({name: name}, function(err, obj){
		if(!obj){
			res.send("Movie Not Found")
		} else {
			var str= obj.name.split(" ")[0];
			console.log("nm: ", str);
			// res.send(obj);
			res.view("page/detail",{data: obj, name: str})
		}
	})
},


// ================================================================
// === Function to get Book Movie Page of particular movie
getBookMovie: function(req, res){
	var name = req.param('name');
	var city = "Ranchi";
	var arr=[], json={};
	Movie.findOne({name: name}, function(err, obj){
		if(!obj){
			res.send("Movie not found");
		} else {
			var str= obj.name.split(" ")[0]; 
			console.log("str: ", str)
City.findOne({city:city},function(err, mvObj){
	if(!mvObj){
		res.send("movie not found in this city");
	} else {
		res.send(mvObj)
	}
})
			// res.send(obj)
			// res.view("page/book",{data: obj, name: str})
		}
	})
},


};

              // var result = skill.replace (/[, ]+/g, " ").trim();
              // var str=result.split(" ");