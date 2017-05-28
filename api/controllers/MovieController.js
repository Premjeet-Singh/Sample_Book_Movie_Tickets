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
City.find({city:city},function(err, mvObj){
	if(!mvObj){
		res.send("movie not found in this city");
	} else {
// // var found = arr.filter(function(item) { return item.name === 'k1'; });
for(var i=0;i<mvObj.length;i++){
	var found = mvObj[i].movie.filter(function(item) { return item.movieName === name; });
	if(found.length>0){
		json.city = mvObj[i].city;
		json.hall = mvObj[i].hall;
		json.movie = mvObj[i].movie.filter(function(item) { return item.movieName === name; });
		arr.push(json);
		json={};
	} 
}		
var date = dateAndMonth();
// console.log(date);
// var found = mvObj[0].movie.filter(function(item) { return item.movieName === name; });
// console.log("found: ", found)
		// res.send(arr)
			res.view("page/book",{data: obj, name: str, arr: arr, date: date})

	}
})
			// res.send(obj)
			// res.view("page/book",{data: obj, name: str, arr: arr})
		}
	})
},

// =================================================================
// === FUNCTION TO CHOOSE NO. OF SEATS TO BOOK ========
noOfSeat: function(req, res){
	var query = {
		date: req.body.dateH,
		time: req.body.timeH,
		hall: req.body.hallH,
		movieName: req.body.movieNameH,
	}
// console.log("Inside action: ", query)
	res.view('page/noOfSeat',{data: query});
},  // noOfseat action closing


// =================================================================
// === Function to choose seat from cinamahall to book tickets
chooseSeat: function(req, res){
	var query = {
		date: req.body.dateH,
		time: req.body.timeH,
		hall: req.body.hallH,
		movieName: req.body.movieNameH,
		num: parseInt(req.body.numH),
	}	
	console.log("Body Data:: ", query)
	res.view('page/chooseSeat',{data: query});
},  // chooseSeat action closing


};  // MODULE EXPORTS CLOSING ******************
// *********************************************




              // var result = skill.replace (/[, ]+/g, " ").trim();
              // var str=result.split(" ");

var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function dateAndMonth(){
  var arr=[],json={};	
  var t = new Date();
  var d = t.getDate();
  var m = t.getMonth();
  var y = t.getFullYear();
  for(var i=0;i<4;i++){
var nd = new Date(y,m,d);
json.date =nd.getDate()+' '+monthNames[nd.getMonth()];
json.day = dayNames[nd.getDay()]; 
arr.push(json);
json={}
d++;
  }
  return arr;
}

