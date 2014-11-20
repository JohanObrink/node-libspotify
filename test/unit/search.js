var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonPromise = require('sinon-promise'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));
sinonPromise(sinon);

describe('search', function () {
  var search, request;
  beforeEach(function () {
    request = {
      get: sinon.stub()
    };
    search = proxyquire(process.cwd() + '/lib/search', {
      'request': request,
      'q': sinonPromise.Q
    });
  });
  it('calls the correct url', function () {
    search('kmfdm');
    var url = 'https://api.spotify.com/v1/search?type=album,artist,playlist,track&q=kmfdm';
    expect(request.get).calledOnce.calledWith(url);
  });
  it('resolves promise on success', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    search('kmfdm').then(success).catch(fail);
    request.get.yield(null, {statusCode: 200}, '{}');
    expect(fail).not.called;
    expect(success).calledWith({});
  });
  it('rejects promise on error', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    search('kmfdm').then(success).catch(fail);
    request.get.yield('error');
    expect(success).not.called;
    expect(fail).calledWith('error');
  });
  it('rejects promise on error code', function () {
    var success = sinon.spy();
    var fail = sinon.spy();
    search('kmfdm').then(success).catch(fail);
    request.get.yield(null, {statusCode: 500}, 'error');
    expect(success).not.called;
    var error = new Error('error');
    error.statusCode = 500;
    expect(fail).calledWith(error);
  });
});