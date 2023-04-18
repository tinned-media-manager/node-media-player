'use strict';

const fs = require('fs');
const path = require('path');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const storage = require ('./storage.js');
const fileFolder = '/media/Music/SHSMS/music';

exports.serverVersion = ('Version 1.23');

exports.musicOBJ = [];
exports.musicList = [];
exports.dir = `${fileFolder}`;

// Process files and folders.
let walk = function (dir, done) {
  let results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        };
      });
    });
  });
};

exports.scanFolder = function () {
  walk(storage.dir, function (err, results) {
    if (err) throw err;
    let processed = [];
    for (let i = 0; i < results.length; i++) {
      let splitting = results[i].split('/');
      let processing = [];
      for (let j = 0; j < splitting.length; j++) {
        if (j < splitting.indexOf('music') + 1) {
          delete splitting[j];
        } else {
          processing.push(splitting[j]);
        }
      }
      processed.push(processing.join('+'));
    }
    storage.musicList = processed;
    saveToJSON(storage.musicList);
  });
};

function loadJSONfile(){

}

function saveToJSON(fileList) {
  let toObject = [];
  for (let i = 0; i < fileList.length; i++) {
    // console.log("***FILELSIT:", dir)
    // let folderFileSplit = fileList[i].split('+');
    // let fileName = folderFileSplit[folderFileSplit.length - 1];
    // folderFileSplit.pop();
    // let folderPath = folderFileSplit.join('/');
    let metaData = {};
    let file = {
      filename: fileList[i],
      folderpath: fileFolder,
      metadata: metaData,
    };
    toObject.push(file);
  }

  // for (let i = 0; i < fileList.length; i++) {
  //   // console.log("***FILELSIT:", fileList[i])
  //   let folderFileSplit = fileList[i].split('+');
  //   let fileName = folderFileSplit[folderFileSplit.length - 1];
  //   folderFileSplit.pop();
  //   let folderPath = folderFileSplit.join('/');
  //   let metaData = {};
  //   let file = {
  //     filename: fileName,
  //     folderpath: folderPath,
  //     metadata: metaData,
  //   };
  //   toObject.push(file);
  // }

  storage.musicOBJ = JSON.stringify(toObject);
  fs.writeFile("./public/master-list.json", JSON.stringify(toObject), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

// Youtube music download
exports.downloadYoutubeMP3 = function(body, res) {
  let url = body.ytURL.split('watch?v=')[1];
  let name = body.ytName + '.mp3';
  let folder = body.ytFolder;
  let YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/usr/bin/ffmpeg",          // Where is the FFmpeg binary located?
    "outputPath": storage.dir + '/' + folder, // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",         // What video quality should be used?
    "queueParallelism": 2,                    // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                   // How long should be the interval of the progress reports
  });
  if(name === '.mp3'){ // Checks if user used custom name
    YD.download(url);
  } else {
    YD.download(url, name);
  }
  YD.on("error", function(error) {
    console.log(error);
    return res.status(500).send(`error: ${error}`);
  });
  YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
  });
  YD.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
    storage.scanFolder();
    return res.status(201).send("youtube audio downloaded");
  });
};

exports.movefile = function(sampleFile, res) {
  sampleFile.mv(`${storage.dir}/${sampleFile.name}`, function (err) {
    console.log('file moving', sampleFile);
    if (err) {
      return res.status(500).send(err);
    }
    let stats = fs.statSync(`${storage.dir}/${sampleFile.name}`); // checks the file size
    let fileSizeInBytes = stats.size;
    storage.musicList = fs.readdirSync(`${storage.dir}`);
    storage.scanFolder();
    console.log('file move complete');
    return res.status(201).send(`${sampleFile.name} Uploaded!  ${fileSizeInBytes} Bytes`);
  });
};
