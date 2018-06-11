
var owner = process.argv[2];
var repo = process.argv[3];


var request = require('request');
var githubToken = require("./secrets.js");
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + githubToken.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);
  });
}


function downloadImageByURL(url, filePath) {

  request.get(url)
     .on('error', function (err) {
       throw err; 
     })

     .on('response', function (response) {
       console.log("Downloading image: ");
     })

     .on('end', function() {
      console.log('Download complete.');
    })

    .pipe(fs.createWriteStream(filePath)
    );
}

function callback (err, result) {
  for (var i = 0; i < result.length; i++) {
    downloadImageByURL(result[i]["avatar_url"], "./avatars/" + result[i]["login"]);
  }
  console.log("Errors: ", err);

}

  getRepoContributors(owner, repo, callback);