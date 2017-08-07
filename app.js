var SpotifyWebApi = require('spotify-web-api-node');

/* Setting things up. */
require('dotenv').config()

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    chalk = require('chalk'),
    sass = require('node-sass-middleware'),
    app = express(),
    Twit = require('twit'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/make-an-image-posting-twitter-bot/#creating-a-twitter-app*/
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter);

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));

var Spotify = Spotify || {

  spotifyApi: {},

  init: () => {
    spotifyApi = new SpotifyWebApi({
      clientId : process.env.clientId,
      clientSecret : process.env.clientSecret,
    });

    return Spotify.getSong();
  },

  getSong: () => {
    spotifyApi.clientCredentialsGrant()
    .then((data) => {
      // Set the access token on the API object so that it's used in all future requests
      spotifyApi.setAccessToken(data.body['access_token']);

      // Get the most popular tracks by David Bowie in Great Britain
      return spotifyApi.searchTracks('Sunshine');
    }).then((data) => {
      var songs = data.body.tracks.items,
          song = songs[Math.floor(Math.random()*songs.length)];
          songPick = {
            name: song.name,
            uri: `https://open.spotify.com/track/${song.id}`,
            artists: song.artists.map((artists) => {return artists['name']})
          };

      return songPick;
    }).then((data) => {
      TwitBot.tweet(data)
    }).catch((err) => {
      console.log('Unfortunately, something has gone wrong.', err.message);
    });
  }
};

var TwitBot = TwitBot || {
  init: () => {
    Spotify.init();
  },

  /* post a tweet with the song's info
    {
      name: "name",
      uri: "spotify uri",
      artists: []
    }
  */
  tweet: (songPick) => {
    // format the artists into a string like so: "artist1 and artist2"
    var artists = songPick.artists.join(' and ');

    // post the tweet!
    T.post('statuses/update', {
      status: `${songPick.name} BY ${artists} ${songPick.uri}>`
    }, (err, data, response) => {
      if (err){
        console.log(err);
      }
      else{
        console.log(`It worked! Here's the data: ${data}`)
      }
    });
  },
};

TwitBot.init();

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});
