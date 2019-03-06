'use strict';

// sudo apt install ffmpeg
// https://www.npmjs.com/package/ffmetadata
const fs = require('fs');
const ffmetadata = require("ffmetadata");

var content;
var parsedMetaData = [];
// First I want to read the file
fs.readFile('public/master-list.json', function read(err, data) {
  if (err) {
    throw err;
  }
  content = JSON.parse(data);
  setMetadata();
});

function setMetadata() {
  for (let i = 0; i < content.length; i++) {
    let filename = content[i].filename;
    let folderpath = content[i].folderpath;
    readMetadata('public/music/' + folderpath + '/' + filename);
    // console.log('public/music/' + folderpath + '/' + filename);
    // console.log(readMetadata('public/music/' + folderpath + '/' + filename));
    // parsedMetaData.push(metaInfo);
  };
  // console.log(parsedMetaData);
};


// let musicFile = "public/music/Scandroid - The Force Theme (Star Wars Cover).mp3"
// let musicFile = "public/music/Alien Ant Farm - Smooth Criminal.mp3"
// let musicFile = "public/music/Van Halen - Jump.mp3"

// Read song.mp3 metadata
function readMetadata(readData) {
  ffmetadata.read(readData, function (err, data) {
    if (err) console.error("Error reading metadata", err);
    else {
      console.log('---', data);
      parsedMetaData.push(data)
      // return data;
    };
  });
};



// console.log(readMetadata());

// Set the artist for song.mp3
// var data = {
//   artist: "Me",
// };
// ffmetadata.write("song.mp3", data, function(err) {
//     if (err) console.error("Error writing metadata", err);
//     else console.log("Data written");
// });