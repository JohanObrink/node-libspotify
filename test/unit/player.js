var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('player', function () {
  var Player, player, libspotify, track, clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    track = {
      duration: 300
    };
    libspotify = {
      createFromLink: sinon.stub().returns(track),
      player: {
        play: sinon.spy(),
        pause: sinon.spy(),
        resume: sinon.spy(),
        currentSecond: 0
      }
    };
    Player = proxyquire(process.cwd() + '/lib/player', {});
    player = new Player(libspotify);
  });
  afterEach(function () {
    clock.restore();
  });

  describe('#play', function () {
    it('calls libspotify.createFromLink with the passed in uri', function () {
      player.play({uri:'foo'});
      expect(libspotify.createFromLink).calledOnce.calledWith('foo');
    });
    it('calls libspotify.play with track', function () {
      player.play({uri:'foo'});
      expect(libspotify.player.play).calledOnce.calledWith(track);
    });
    it('sets playing to true', function () {
      player.play({uri:'foo'});
      expect(player.playing).to.be.true;
    });
    it('resumes currentTrack if it exists and no uri is passed in', function () {
      player.currentPlayerTrack = track;
      player.play();
      expect(libspotify.createFromLink).not.called;
      expect(libspotify.player.resume).calledOnce;
    });
    it('emits play event with the current track (not playerTrack)', function () {
      var listener = sinon.spy();
      player.on('play', listener);
      player.play({uri:'foo'});
      expect(listener).calledOnce.calledWith({uri:'foo'});
    });
    it('emits progress events', function () {
      var listener = sinon.spy();
      player.on('progress', listener);
      player.play({uri:'foo'});
      expect(listener).calledOnce.calledWith({elapsed:0, duration: 300});
      libspotify.player.currentSecond = 0;
      clock.tick(100);
      expect(listener).calledOnce;
      libspotify.player.currentSecond = 1;
      clock.tick(100);
      expect(listener).calledTwice.calledWith({elapsed:1, duration: 300});
    });
  });
  describe('#pause', function () {
    beforeEach(function () {
      sinon.stub(player, 'checkProgress');
    });
    afterEach(function () {
      player.checkProgress.restore();
    });
    it('does nothing if not playing', function () {
      var listener = sinon.spy();
      player.on('pause', listener);
      player.playing = false;
      player.pause();
      expect(libspotify.player.pause).not.called;
      expect(listener).not.called;
    });
    it('calls libspotify.player.pause', function () {
      player.playing = true;
      player.pause();
      expect(libspotify.player.pause).calledOnce;
    });
    it('sets playing to false', function () {
      player.playing = true;
      player.pause();
      expect(player.playing).to.be.false;
    });
    it('emits pause event', function () {
      var listener = sinon.spy();
      player.on('pause', listener);
      player.playing = true;
      player.pause();
      expect(listener).calledOnce;
    });
    it('forces an extra checkProgress call', function () {
      player.playing = true;
      player.pause();
      expect(player.checkProgress).calledOnce;
    });
  });
});