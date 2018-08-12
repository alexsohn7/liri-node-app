// Global variables
require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var commandLineArguement = process.argv[2];
var movieOrSong = process.argv[3];

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Commands
if (commandLineArguement) {
  if (commandLineArguement === "my-tweets") {
    getTweets();
  } else if (commandLineArguement === "movie-this") {
    displayMovieData();
  } else if (commandLineArguement === "spotify-this-song") {
    getSongs();
  } else if (commandLineArguement === "do-what-it-says") {
    runCommandBasedOnTextFile();
  }
}

// Functions
function displayMovieData() {
  if (movieOrSong) {
    getMovieDataBasedOnSearch();
  } else {
    displayMrNobody();
  }
}

function getMovieDataBasedOnSearch() {
  var movieName = "";

  for (var i = 3; i < process.argv.length; i++) {
    if (i > 3 && i < process.argv.length) {
      movieName = movieName + "+" + process.argv[i];
    } else {
      movieName += process.argv[i];
    }
  }

  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=c4935f32";

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("\n" + "Movie: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log(
        "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
      );
      console.log(
        "Country where the movie was produced: " + JSON.parse(body).Country
      );
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

function displayMrNobody() {
  request(
    "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=c4935f32",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("\n" + "Movie: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log(
          "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
        );
        console.log(
          "Country where the movie was produced: " + JSON.parse(body).Country
        );
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
      }
    }
  );
}

function getTweets() {
  var Twitter = require("twitter");

  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: "alexsohn6",
    include_rts: 0,
    exclude_replies: true,
    trim_user: true,
    count: 20
  };

  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i].text;
      var timeTweeted = tweets[i].created_at;

      console.log("\n" + "--------- TWEET ---------");
      console.log(timeTweeted + ": " + tweet);
    }
  });
}

function getSongs() {
  if (movieOrSong) {
    var songName = "";

    for (var i = 3; i < process.argv.length; i++) {
      if (i > 3 && i < process.argv.length) {
        songName = songName + "+" + process.argv[i];
      } else {
        songName += process.argv[i];
      }
    }

    spotify.search({ type: "track", query: songName, limit: 5 }, function(
      error,
      data
    ) {
      if (error) {
        return console.log("Error occurred: " + error);
      }

      for (var i = 0; i < 5; i++) {
        console.log(
          "\n" +
            "-------------TRACK--------------" +
            "\n" +
            "Song: " +
            data.tracks.items[i].name +
            "\n" +
            "Artist: " +
            data.tracks.items[i].artists[0].name +
            "\n" +
            "URL: " +
            data.tracks.items[i].preview_url +
            "\n" +
            "Album: " +
            data.tracks.items[i].album.name +
            "\n"
        );
      }
    });
  }
}

function runCommandBasedOnTextFile() {
  var fs = require("fs");

  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log("Error occured: " + err);
    }

    var output = data.split(",");

    var newOutputQuery = {
      type: "track",
      query: output[1],
      limit: 5
    };

    spotify.search(newOutputQuery, function(err, data) {
      if (err) {
        console.log("Error: " + err);
      } else {
        for (var i = 0; i < 5; i++) {
          console.log(
            "\n" +
              "-------------TRACK--------------" +
              "\n" +
              "Song: " +
              data.tracks.items[i].name +
              "\n" +
              "Artist: " +
              data.tracks.items[i].artists[0].name +
              "\n" +
              "URL: " +
              data.tracks.items[i].preview_url +
              "\n" +
              "Album: " +
              data.tracks.items[i].album.name +
              "\n"
          );
        }
      }
    });
  });
}
