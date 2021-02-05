require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

//enter the app
app.get('/', (req, res) => {
  res.render('index');
});

//for artist route
app.get('/artist-search', (req, res) => {
  //here we are using a method from the npm package:
  spotifyApi
  .searchArtists(req.query.artist) //artist here is the one on my hbs, if they wrote bananas on "name", it was bananas______-Use query because is a form with a GET reference
  .then(data => { //promise resolve
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', { artistList: data.body.artists.items //itens is an array odf objects that contains the info that we look on terminal
      //data shows on terminal, that's were we will find the type and info
    });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


//for albums route
app.get('/albums/:artistId', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((albums) => {
      console.log(albums.body.items) //items from terminal with the data
      res.render('albums', { albums: albums.body.items })
    });
})

//for tracks route
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then((tracks) => {
    console.log(tracks.body.items)
    res.render('tracks', { tracks: tracks.body.items })
  });
}) 



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
