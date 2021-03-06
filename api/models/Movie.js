/**
 * Movie.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:                      { type: 'string' },
    language:                  { type: 'string' },
    type:                      { type: 'string' },
    dimension:                 { type: 'string' },
    releaseDate:               { type: 'string' },
    runTime:                   { type: 'string' },
    director:                  { type: 'string' },
    genre:                     { type: 'string' },
    city:                      { type: 'array' },
  }
};

