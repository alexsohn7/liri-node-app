// Require 
require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");

// Console Arguements 
var commandLineArguement = process.argv[2];
var movieOrSong = process.argv[3];

// Commands 
if (commandLineArguement) {
    if (commandLineArguement === 'my-tweets') {
        myTweets();
    } else if (commandLineArguement === 'movie-this') {
        movieThis();
    } else if (commandLineArguement === 'spotify-this-song') {
        spotifyThisSong();
    } else if (commandLineArguement === 'do-what-it-says') {
        doWhatItSays();
    }
}

// Functions 
function movieThis() {
    if (movieOrSong) {
        var movieName = "";

        for (var i = 3; i < process.argv.length; i++) {
            if (i > 3 && i < process.argv.length) {
                movieName = movieName + "+" + process.argv[i];
            } else {
                movieName += process.argv[i];
            }
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=c4935f32";

        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country where the movie was produced: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
    } else {
        request("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=c4935f32",
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("Title: " + JSON.parse(body).Title);
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
}

function myTweets() {
    var Twitter = require("twitter");

    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: 'alexsohn6',
        include_rts: 0,
        exclude_replies: true,
        trim_user: true,
        count: 20
    }

    client.get("statuses/user_timeline", params, getTweets);

    function getTweets(error, tweets, response) {
        for (var i = 0; i < tweets.length; i++) {
            var tweet = tweets[i].text;
            var timeTweeted = tweets[i].created_at;

            console.log("---------NEW TWEET ---------");
            console.log(tweet);
            console.log(timeTweeted);
        }
    }
};

function spotifyThisSong() {
    var Spotify = require("node-spotify-api");

    var spotify = new Spotify(keys.spotify);

    if (movieOrSong) {
        var songName = "";

        for (var i = 3; i < process.argv.length; i++) {
            if (i > 3 && i < process.argv.length) {
                songName = songName + "+" + process.argv[i];
            } else {
                songName += process.argv[i];
            }
        }

        spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            for (var i = 0; i < 5; i++) {


                console.log(
                    "Song: " + data.tracks.items[i].name + "\n" +
                    "Artist: " + data.tracks.items[i].artists[0].name + "\n" +
                    "URL: " + data.tracks.items[i].preview_url + "\n" +
                    "Album: " + data.tracks.items[i].album.name
                )
            };

        });
    }
}

function doWhatItSays() {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log("Error occured: " + err);
        }

        console.log(data);

        var output = data.split(",");
        console.log(output);

        for (var i = 0; i < output.length; i++) {
            console.log(output[i]);
        }

    })
}