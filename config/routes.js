/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': { view: 'homepage' },
  'GET /register': { view: 'register' },

  'GET /login': { view: 'login' },
  // 'GET /movie': { view: 'page/movie' },





//===========  routes for Movie Controller  ===================================
  'GET /movieupload': { view: 'uploader/movieUpload' },
  'POST /movieupload': {controller: "movie", action: "movieUpload"},
  'GET /movie': {controller: "movie", action: "movieList"},
  'GET /movie/:name': {controller: "movie", action: "movieParticular"},
  'GET /book/:name': {controller: "movie", action: "getBookMovie"},



//===========  routes for City Controller  ===================================
  'GET /cinemainhall': { view: 'uploader/cinemaInHall' },
  'POST /cinemainhall': {controller: "city", action: "cinemaInHall"},

'GET /srs': { view: 'uploader/srs' },
'POST /srs': {controller: "city", action: "addInSrs"},

//================ Users & Auth Controller============================================
//===========  routes for users Controller  ===================================
  'POST /register': {controller: "users", action: "register"},
  // 'POST /login': {controller: "users", action: "login"},                   // works well using token
  'POST /login': {controller: "auth", action: "login"},              //  updated using passport
  // 'GET /logout': {controller: "users", action: "logout"},                  // works well using token
  'GET /logout': {controller: "auth", action: "logout"},             //  updated using passport





//===========  routes for users Controller  ===================================
  'GET /test': {controller: "test", action: "test"},
  'POST /upload': {controller: "test", action: "upload"},
  'GET /img': { view: 'uploadImage' }, 
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
