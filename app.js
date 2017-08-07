var SpotifyWebApi = require('spotify-web-api-node');

/* Setting things up. */
require('dotenv').config()

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    chalk = require('chalk'),
    sass = require('node-sass-middleware'),
    app = express(),
    /* how we will talk to the twitter api */
    Twit = require('twit'),
    /* Be sure to update the .env file with your API keys.
      From Twitter: https://apps.twitter.com/app/new
      From Spotify: https://developer.spotify.com/my-applications/#!/applications/create
    */
    config = {
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      },
      spotify: {
        clientId : process.env.clientId,
        clientSecret : process.env.clientSecret
      }
    };

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));

var Spotify = Spotify || {

  api: {},

  init: () => {
    Spotify.api = new SpotifyWebApi(config.spotify);

    return Spotify.getSong();
  },

  getSong: () => {
    /* let's get the credentials to get access to the Spotify API */
    Spotify.api.clientCredentialsGrant()
    /* the credentials are returned and _then_ we move on to the next steps */
    .then((data) => {
      /* Set the access token on the API object so that it's used in all future requests */
      Spotify.api.setAccessToken(data.body['access_token']);

      /* Search tracks by theme and return them */
      return Spotify.api.searchTracks('Sun');
    }).then((data) => {
      var songs = data.body.tracks.items,
          song = songs[Math.floor(Math.random()*songs.length)];
          /* let's store the song data into an object: {} so it's easier to decipher later */
          songPick = {
            name: song.name,
            uri: `https://open.spotify.com/track/${song.id}`,
            artists: song.artists.map((artists) => {return artists['name']})
          };

      /* let's return our fresh songPick */
      return songPick;
    }).then((data) => {
      TwitBot.tweet(data)
    }).catch((err) => {
      console.log('Unfortunately, something has gone wrong.', err.message);
    });
  }
};

var TwitBot = TwitBot || {

  api: {},

  init: () => {
    TwitBot.api = new Twit(config.twitter);
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
    /* format the artists into a string like so: "artist1 and artist2" */
    var artists = songPick.artists.join(' and ');

    /* post the tweet! */
    TwitBot.api.post('statuses/update', {
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
