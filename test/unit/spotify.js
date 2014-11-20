var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonPromise = require('sinon-promise'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('/spotify', function () {

  var nodeSpotify, libSpotify, Spotify, spotify, options;

  beforeEach(function () {
    libSpotify = {
      on: sinon.stub(),
      login: sinon.stub()
    };

    nodeSpotify = sinon.stub().returns(libSpotify);

    options = {
      appkeyFile: '/spotify_appkey.key'
    };

    Spotify = proxyquire(process.cwd() + '/lib/spotify', {
      'node-spotify': nodeSpotify,
      'q': sinonPromise.Q
    });
  });

  describe('constructor', function () {
    it('returns a funciton reference', function () {
      expect(Spotify).to.be.a('function');
    });
    it('calls node-spotify with options', function () {
      spotify = new Spotify(options);
      expect(spotify).to.be.instanceof(Spotify);
      expect(nodeSpotify).calledWith(options);
    });
  });
  describe('#login', function () {
    var listeners, success, fail;
    beforeEach(function () {
      spotify = new Spotify(options);
      listeners = libSpotify.on.firstCall.args[0];

      success = sinon.spy();
      fail = sinon.spy();
      spotify.login('foo', 'bar').then(success).catch(fail);
    });
    it('calls spotify.login with username and password', function () {
      expect(libSpotify.login).calledOnce.calledWith('foo', 'bar');
    });
    it('resolves the promise onReady', function () {
      listeners.ready();
      expect(success, 'success').calledOnce;
      expect(fail, 'fail').not.called;
    });
    it('rejects the promise onLogout', function () {
      listeners.logout();
      expect(success, 'success').not.called;
      expect(fail, 'fail').calledOnce;
    });
    it('throws if login is attempted while logging in', function () {
      var success2 = sinon.spy();
      var fail2 = sinon.spy();
      spotify
        .login('foo', 'bar')
        .then(success2)
        .catch(fail2);
      expect(success2).not.called;
      expect(fail2).calledOnce.calledWith(new Error('Already logging in'));
    });
    it('throws if login is attempted when logged in', function () {
      listeners.ready();
      var success2 = sinon.spy();
      var fail2 = sinon.spy();
      spotify
        .login('foo', 'bar')
        .then(success2)
        .catch(fail2);
      expect(success2).not.called;
      expect(fail2).calledOnce.calledWith(new Error('Already logged in'));
    });
    it('does not reject the promise on logout if login is finished', function () {
      listeners.ready();
      expect(success).calledOnce;
      listeners.logout();
      expect(fail).not.called;
    });
    it('emits a logout event if logout is called after login is finished', function () {
      var listener = sinon.spy();
      spotify.on('logout', listener);
      listeners.ready();
      listeners.logout();
      expect(listener).calledOnce;
    });
  });
});