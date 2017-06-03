/**
 * MovieController
 *
 * @description :: Server-side logic for managing movies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

// =====================================================
// === Function to view homepage ==============
home: function(req, res){
	
	res.view('homepage',{user:req.session.passport})
},  // home action closing


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
		// res.send("Movie already exist")
		res.view('ok',{msg: "Movie already exist"})
	}
})


// res.send(query);
},


// ==================================================================
// === Function to get list of all movies ========================
// GET route /movie
movieList: function(req, res){
	var city = req.query.city;
	res.cookie('city', city, { expires: new Date(Date.now() + 2592000000), httpOnly: true, signed: true });
	Movie.find({}, function(err, obj){
		if(obj==''){
			// res.send("Movies not found")
			res.view('ok', {msg:"Movie not found"})
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
			// res.send("Movie Not Found")
			res.view('ok', {msg:"Movie not found"})
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
// GET route /book/:name?city=ranchi
getBookMovie: function(req, res){
	var name = req.param('name');
	var city = req.signedCookies.city;
	console.log('ciittyy: ', city)
	var arr=[], json={};
	Movie.findOne({name: name}, function(err, obj){
		if(!obj){
			// res.send("Movie not found");
			res.view('ok', {msg:"Movie not found"})
		} else {
			var str= obj.name.split(" ")[0]; 
			console.log("str: ", str)
City.find({city:city},function(err, mvObj){
	if(!mvObj){
		// res.send("movie not found in this city");
			res.view('ok', {msg:"Movie not found"})
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
		screen: req.body.screenH,
		price: req.body.priceH,
	}
// console.log("Inside action: ", query)
	res.view('page/noOfSeat',{data: query});
},  // noOfseat action closing


// =================================================================
// === Function to choose seat from cinamahall to book tickets
chooseSeat: function(req, res){
	var price = req.body.priceH;
	    price = price.replace(/^[,\s]+|[,\s]+$/g, '');
	    price = price.replace(/\s*,\s*/g, ',');
	 	price = price.split(',').map(Number);
var city = req.signedCookies.city;
	var query = {
		date: req.body.dateH,
		time: req.body.timeH,
		hall: req.body.hallH,
		movieName: req.body.movieNameH,
		screen: req.body.screenH,
		price: price,
		num: parseInt(req.body.numH),
	}
Movie.findOne({name: query.movieName}, function(err, obj){
	if(!obj){
		console.log("movie not found")
	} else {
		console.log("Body Data:: ", query)
// City.findOne({city:city, hall: query.hall}, function(err, cityObj){
// 	if(!cityObj){
// 		console.log("city and hall not found");
// 	} else {
// 		console.log("City obj: ", cityObj)
// 	}
// })
City.native(function (err, Collection){
	Collection.findOne({'city':city,'hall':query.hall}, 
	{movie: {$elemMatch: {time: query.time,movieName:query.movieName,screen:query.screen}}},function(err, cityObj){
		if(!cityObj){
			console.log("city and hall not found");
		} else {
			console.log("City obj: ", cityObj)
// mvObj[i].movie.filter(function(item) { return item.movieName === name; });
// var qd = query.date.toString();
			var reserve = cityObj.movie[0].reserve.filter(function(item) { return item.date === query.date; });

			res.view('page/chooseSeat',{data: query, obj: obj, reserve: reserve[0].seat});
		}		
	});
});
		// res.view('page/chooseSeat',{data: query, obj: obj, reserve: reserve});		
	}
})	

},  // chooseSeat action closing


// =================================================================
// === FUNCTION TO CREATE AMOUNT SUMMARY TO PAY ========
amountToPay: function(req, res){
	var arr = req.body.seatNoH.split(',');
	var seatNo =[];
	for(var i = 0;i<parseInt(req.body.numH);i++){
		seatNo.push(arr[i]);		
	}
var ticketAmount = parseInt(req.body.totalH);
var fees = (12.5/100)*ticketAmount;
var subTotal = ticketAmount + fees;
	var query = {
		date: req.body.dateH,
		time: req.body.timeH,
		hall: req.body.hallH,
		movieName: req.body.movieNameH,
		screen: req.body.screenH,
		language: req.body.languageH,
		dimension: req.body.dimensionH,
		total: req.body.totalH,
		num: req.body.numH,
		seatNo:seatNo,
		fees: fees,
		subTotal: subTotal
	}
console.log("Inside action: ", query)
	res.view('page/amountToPay',{data: query});

},  // noOfseat action closing



// ==========================================================
// === Function to reserve seat and update in database ==
reserveSeat: function(req, res){
	// var owner = '58ea8204dc3d35dc16ce68e8';
	var owner = req.session.passport.user;
	var city = req.signedCookies.city;
	var arr = req.body.seatNoH.split(',');
	var seatNo =[];
	for(var i = 0;i<parseInt(req.body.numH);i++){
		seatNo.push(arr[i]);		
	}
	var query = {
		city: city,
		date: req.body.dateH,
		time: req.body.timeH,
		hall: req.body.hallH,
		movieName: req.body.movieNameH,
		screen: req.body.screenH,
		language: req.body.languageH,
		dimension: req.body.dimensionH,
		total: parseInt(req.body.totalH),
		num: parseInt(req.body.numH),
		seatNo:seatNo,
		fees: parseInt(req.body.feesH),
		subTotal: parseInt(req.body.subTotalH)
	}
var index=0, resIndex=0;
City.findOne({city:city, hall: query.hall}, function(err, obj){
	if(!obj){
		console.log('city and hall not found')
	} else {
		// console.log(obj);
for(var i=0;i<obj.movie.length;i++){
if(obj.movie[i].time==query.time && obj.movie[i].screen==query.screen){
index=i;
console.log(i,' and ',index);
	for(var j=0;j<obj.movie[i].reserve.length;j++) {
		if(obj.movie[i].reserve[j].date==query.date){
			resIndex = j;
		}
	}
}
}
var matchField = 'movie.'+index+'.reserve.'+resIndex+'.seat';
for(var i=0;i<seatNo.length;i++){


City.native(function (err, Collection){
	Collection.update({'city':city,'hall':query.hall},
	{$push:{[matchField]:seatNo[i]}},function(err, cityObj){
		if(!cityObj){
			console.log("city and hall not found");
		} else {
			// console.log("City obj: ", cityObj)
			
		}
	});
});
}
sendTicketToUser(owner, query);
// ===
	}
})
	// res.send(query);
	res.view('page/ticket',{data:query});

},  // reserveSeat action closing




};  // MODULE EXPORTS CLOSING ******************
// *********************************************

function sendTicketToUser(owner, query){

Users.findOne({id:owner}, function(err, user){
	if(!user){
		console.log("User not found");
	} else {
		Bought.create({owner: owner, movie: query}, function(err, obj){
			query.email = user.local.email;
			mailer.sendTicketMail(query);
			console.log('Bought created');
		})
	}
})
}



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

