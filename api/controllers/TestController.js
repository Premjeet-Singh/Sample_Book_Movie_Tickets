/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sid = require('shortid');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = {
// ======================================================
test: function(req, res){
	res.send("This is test route");
},

upload: function(req, res){
	// var sampleFile = req.files.sampleFile;
	// var sampleFile = req.file('sampleFile');
	// var dir = '/assets/images/pic';
// 	mkdirp(dir, function(err){
// 	 	fs.writeFile(dir, sampleFile, function (err) {
// 	          if (err) {
// 	            res.json({'error': 'could not write file to storage'});
// 	          } else {	
// 				res.send('File uploaded!');
// 	          }	
// 		})
// 	})
// console.log("Img: ", sampleFile) 	 
    // req.file('sampleFile').upload({dirname:'../assets/images/'},function (err, files) {
    //   if (err)
    //     return res.serverError(err);

    //   return res.json({
    //     message: files.length + ' file(s) uploaded successfully!',
    //     files: files
    //   });
    // });	    
// req.file('sampleFile').upload({
//   dirname: require('path').resolve(sails.config.appPath, 'assets/images/pics/dp.jpg')
// },function (err, uploadedFiles) {
//   if (err) return res.negotiate(err);

//   return res.json({
//     message: uploadedFiles.length + ' file(s) uploaded successfully!'
//   });
// });

req.file('sampleFile').upload({dirname : process.cwd() + '/assets/images/uploads/'}, function (err, uploadedFiles) {
              if (err) return res.send(500, err);
 var abc = 'aaa'
                var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/')+1);
                var uploadLocation = process.cwd() +'/assets/images/uploads/' + filename;
                var tempLocation = process.cwd() + '/.tmp/public/images/uploads/' + filename;
 
                //Copy the file to the temp folder so that it becomes available immediately
                fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
 
                //Redirect or do something
                // res.view();
                console.log(filename);
                res.send("done: "+uploadLocation)
            });

}
  // req.file('userPhoto').upload({
  //  dirname:'C:/Users/RAKESH KUMAR/Desktop/authentication/assets/images/'},function(err,files){
  //  sails.log.debug('file is :: ', +files);
  //   maxBytes: 10000000;
  //  if (err) return res.serverError(err);        
  //  console.log(files);
  //     res.json({status:200,file:files});
  //  });

};



// sampleFile = req.files.sampleFile;
 
//   // Use the mv() method to place the file somewhere on your server 
//   sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
//     if (err)
//       return res.status(500).send(err);
 
//     res.send('File uploaded!');
