'use strict';

const fs = require('fs');
// const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const readline = require('readline');
const ffmetadata = require("ffmetadata");
const cmd = require('node-cmd');
const Base64 = require('js-base64').Base64;

const server = require('./index.js');
const resourceRouter = require('./router.js');
const storage = require ('./storage.js');
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/', resourceRouter);

if (!fs.existsSync(storage.dir)) {
  fs.mkdirSync(storage.dir);
}

app.listen(PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.')
  console.log('Server started:', new Date());
  console.log('Currently running on', storage.serverVersion)
});

// Admin console commands
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input === 'print list') {
    console.log(storage.musicList);
  } else if (input === 'print object') {
    console.log(storage.musicOBJ);
  } else if (input === 'scan folder') {
    storage.scanFolder();
  } else if (input === 'version') {
    console.log(storage.serverVersion);
  } else if (input === 'update') {
    server.update(); 
  } else {
    console.log(input, 'is not a valid input')
  };
});

// update from github master
exports.update = function(){
  cmd.get('git pull origin master'),
  function (err, data, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  };
  cmd.get('npm install -y'),
  function (err, data, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  };
};

storage.scanFolder();