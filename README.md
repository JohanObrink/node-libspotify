node-libspotify
===============

A wrapper for the node wrapper for libspotify. Because - you know - you can never have to many levels of abstraction. Also, the node-spotify lib is not entirely, but almost, unlike any code you would ever write or access in node.

It also wraps the new spotify web api so the songs passed around are in the new format even if, internally, the played songs are in the old. Search is performed through the api instead of through libspotify.

#How to

Make sure the prerequisites are met. Then install:

```shell
npm install node-libspotify
```

##Create a Spotify client and login (requires a premium account)
```javascript
var Spotify = require('node-libspotify');
var appKeyPath = '[path to spotify_appkey.key]';
var spotify = new Spotify({appkeyFile: appKeyPath});
spotify.login('username', 'password')
  .then(function () {
    //logged in
  })
  .catch(function (err) {
    //wrong username and/or password
  });
```

###Play
```javascript
var track = {
  uri: 'spotify:track:7gss5MqLM5sHlHOl2EAbrp'
};
spotify.player.on('play', function (track) { /* play event */ });
spotify.player.on('pause', function () { /* pause event */ });
spotify.player.on('progress', function (progress) { /* progress event */ });
spotify.player.play(track);
```

###Search
```javascript
spotify.search('Austrian death machine')
  .then(function (result) {
    //matching artists, albums, tracks and playlists
  })
  .catch(function (err) {
    //search error
  });
```



#Prerequisites

##App key
Create an app key at https://devaccount.spotify.com/my-account/keys/

Download key as [Binary] and save it as ```spotify_appkey.key``` in app root

##libspotify

###Mac
```shell
brew update
brew upgrade
brew install homebrew/binary/libspotify
```
####If linking fails
Run ```sudo chown -R `whoami` /usr/local/share/man/man3``` or whatever directory the linking function is complaining about,
and then ```brew link libspotify```

###All
```shell
npm install
```
####If install fails
Run ```sudo chown -R `whoami` ~/.npm/```

### If run fails with Error: dlopen
Run ```sudo ln -s /usr/local/opt/libspotify/lib/libspotify.12.1.51.dylib /usr/local/opt/libspotify/lib/libspotify``` to symlink the dylib



The MIT License (MIT)
----------------------

Copyright (c) 2014 Johan Öbrink

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
