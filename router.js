'use strict';

const express = require('express');
const Router = express.Router;
// const server = require('./index.js');
// const createError = require('http-errors');

const resourceRouter = new Router();

// let musicOBJ = server;
// let serverVersion = ;

resourceRouter.use(express.static('./public'));

resourceRouter.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: './public' });
})

resourceRouter.get('/api/admin/update', (req, res) => {
  console.log('Updating to: ' + server.serverVersion);
  // res.status(200).send('Updating to: ' + serverVersion);
  // update();
})

// resourceRouter.route('/api/audio/:audio').get((req, res) => {
//   console.log(musicOBJ)
//   let filePath = '';
//   for (let i = 0; i < musicOBJ.length; i++) {
//     if (JSON.parse(musicOBJ)[i].filename === req.params.audio) {
//       if (JSON.parse(musicOBJ)[i].folderpath === '') {
//         break
//       }
//       filePath = JSON.parse(musicOBJ)[i].folderpath + '/'
//       break;
//     }
//   }
//   console.log('sending: ', `music/${filePath}${req.params.audio}`)
//   res.set('Content-Type', 'audio/mpeg');
//   res.sendFile(`music/${filePath}${req.params.audio}`, { root: './public' });
// });

// resourceRouter.route('/api/tracklist/').get((req, res) => {
//   res.send(musicOBJ);
// });

// // express-fileupload application.
// resourceRouter.post('/api/upload', function (req, res) {
//   if (!req.files) {
//     return res.status(400).send('No files were uploaded.');
//   }
//   // The name of the input field (i.e "sampleFile") is used to retrieve the uploaded file.
//   let sampleFile = req.files.sampleFile;
//   movefile(sampleFile, res);

//   console.log('sending 201 status')
//   // return res.status(201).send('file upload sucess');
//   // return res.status(201);
// });

module.exports = resourceRouter;