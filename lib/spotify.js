var q = require('q'),
  EventEmitter = require('events').EventEmitter,
  _ = require('lodash'),

  Player = require('./player'),
  search = require('./search');

function Spotify(options) {
  EventEmitter.call(this);
  _.bindAll(this);

  this.libspotify = require('node-spotify')(options);

  this.libspotify.on({
    ready: this._onReady,
    metadataUpdated: this._onMetadataupdated,
    logout: this._onLogout
  });

  this.player = new Player(this.libspotify);
  this.loggedIn = false;
}
Spotify.prototype = Object.create(EventEmitter.prototype);
Spotify.prototype.constructor = Spotify;

Spotify.prototype.login = function(username, password, remember, useRemembered) {
  var deferred = q.defer();

  if(this._loginPromise || this.loggedIn) {
    var error = this.loggedIn ? 'Already logged in' : 'Already logging in';
    deferred.reject(new Error(error));
  } else {
    remember = !!remember;
    useRemembered = !!useRemembered;

    this._loginPromise = deferred;
    this.libspotify.login(username, password, remember, useRemembered);
  }
  return deferred.promise;
};

Spotify.prototype.search = search;

// app level listeners
Spotify.prototype._onReady = function() {
  if(this._loginPromise) {
    this.loggedIn = true;
    this._loginPromise.resolve();
    delete this._loginPromise;
  }
  this.emit('login');
};

Spotify.prototype._onMetadataupdated = function() {
  /*console.log('playlistContainer', this.libspotify.playlistContainer.isLoaded);
  console.log('sessionUser', this.libspotify.sessionUser.isLoaded);
  console.log('sessionUser.starredPlaylist', this.libspotify.sessionUser.starredPlaylist.isLoaded);
  console.log('sessionUser.playlistContainer', this.libspotify.sessionUser.playlistContainer.isLoaded);
  console.log('----');

  console.log(this.libspotify.playlistContainer);*/

  this.emit('metadata');
};

Spotify.prototype._onLogout = function() {
  this.loggedIn = false;
  if(this._loginPromise) {
    this._loginPromise.reject();
    delete this._loginPromise;
  } else {
    this.emit('logout');
  }
};

module.exports = Spotify;