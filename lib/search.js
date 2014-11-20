var request = require('request'),
  q = require('q');

function search(query) {
  var deferred = q.defer();
  var url = 'https://api.spotify.com/v1/search?type=album,artist,playlist,track&q=';
  request.get(url + query, function (err, response, body) {
    if(err) {
      deferred.reject(err);
    } else if(response.statusCode >= 400) {
      var error = new Error(body);
      error.statusCode = response.statusCode;
      deferred.reject(error);
    } else {
      deferred.resolve(JSON.parse(body));
    }
  });
  return deferred.promise;
}

module.exports = search;