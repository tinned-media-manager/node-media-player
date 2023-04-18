'use strict';

const express = require('express');
const Router = express.Router;
const server = require('./index.js');
const storage = require ('./storage.js');

const resourceRouter = new Router();

resourceRouter.use(express.static('./public'));

resourceRouter.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: './public' });
});

resourceRouter.get('/api/admin/update', (req, res) => {
  console.log('Updating to: ' + storage.serverVersion);
  res.status(200).send('Updating to: ' + storage.serverVersion);
  server.update();
});

resourceRouter.route('/api/audio/:audio').get((req, res) => {
  let filePath = '';
  for (let i = 0; i < storage.musicOBJ.length; i++) {
    if (JSON.parse(storage.musicOBJ)[i].filename === req.params.audio) {
      if (JSON.parse(storage.musicOBJ)[i].folderpath === '') {
        break;
      }
      filePath = JSON.parse(storage.musicOBJ)[i].folderpath + '/';
      break;
    }
  }
  console.log('sending: ', `${filePath}${req.params.audio}`);
  res.set('Content-Type', 'audio/mpeg');
  res.sendFile(`${filePath}${req.params.audio}`);
});

resourceRouter.route('/api/tracklist/').get((req, res) => {
  res.send(storage.musicOBJ);
});

resourceRouter.post('/api/ytupload', function (req, res) {
  storage.downloadYoutubeMP3(req.body, res);
});

resourceRouter.post('/api/upload', function (req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e "sampleFile") is used to retrieve the uploaded file.
  let sampleFile = req.files.sampleFile;
  storage.movefile(sampleFile, res);
  console.log('sending 201 status');
});

module.exports = resourceRouter;
