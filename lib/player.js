var EventEmitter = require('events').EventEmitter;

function Player(libSpotify) {
  EventEmitter.call(this);

  this.libSpotify = libSpotify;
  this.playing = false;
}
Player.prototype = Object.create(EventEmitter.prototype);
Player.prototype.constructor = Player;

Player.prototype.play = function (track) {
  if(track) {
    this.currentTrack = track;
    this.currentPlayerTrack = this.libSpotify.createFromLink(this.currentTrack.uri);
    this.libSpotify.player.play(this.currentPlayerTrack);
  } else {
    this.libSpotify.player.resume();
  }
  this.playing = true;
  this.lastElapsed = -1;
  this.emit('play', this.currentTrack);
  this.checkProgress();
};

Player.prototype.pause = function () {
  if(this.playing) {
    this.libSpotify.player.pause();
    this.playing = false;
    this.lastElapsed = -1;
    this.emit('pause');
    this.checkProgress();
  }
};

Player.prototype.checkProgress = function() {
  clearTimeout(this.progressTimeout);
  var elapsed = this.libSpotify.player.currentSecond;
  if(elapsed !== this.lastElapsed) {
    this.emit('progress', {
      elapsed: elapsed,
      duration: this.currentPlayerTrack.duration
    });
    this.lastElapsed = elapsed;
  }
  if(this.playing) {
    this.progressTimeout = setTimeout(this.checkProgress.bind(this), 100);
  }
};

Player.prototype.listen = function(socket) {
  socket.on('play', this.play.bind(this));
  socket.on('pause', this.pause.bind(this));
};

module.exports = Player;