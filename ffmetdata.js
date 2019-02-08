'use strict';
// sudo apt install ffmpeg
// https://www.npmjs.com/package/ffmetadata
const ffmetadata = require("ffmetadata");
 
// Read song.mp3 metadata
ffmetadata.read("public/music/Boston - More Than a Feeling.mp3", function(err, data) {
    if (err) console.error("Error reading metadata", err);
    else console.log(data);
});
 
// Set the artist for song.mp3
// var data = {
//   artist: "Me",
// };
// ffmetadata.write("song.mp3", data, function(err) {
//     if (err) console.error("Error writing metadata", err);
//     else console.log("Data written");
// });