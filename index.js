'use strict';

const serverVersion = ('Version 1.15');

const fs = require('fs');
const path = require('path');
const express = require('express')
// const http = require('http').Server(app);
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const readline = require('readline');
const ffmetadata = require("ffmetadata");
const cmd = require('node-cmd');
const resourceRouter = require('./router.js');
const test = require('./test.js');
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/', resourceRouter);

var dir = './public/music';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let musicList = []
module.exports = musicList
let musicOBJ = []
module.exports = musicOBJ


// static files
// app.use(express.static('./public'));

// app.get('/', (req, res) => {
//   res.sendFile('public/index.html', { root: './public' });
// })

// app.get('/api/admin/update', (req, res) => {
//   res.status(200).send('Updating to: ' + serverVersion);
//   update();
// })

app.route('/api/audio/:audio').get((req, res) => {
  let filePath = '';
  for (let i = 0; i < musicOBJ.length; i++) {
    if (JSON.parse(musicOBJ)[i].filename === req.params.audio) {
      if (JSON.parse(musicOBJ)[i].folderpath === '') {
        break
      }
      filePath = JSON.parse(musicOBJ)[i].folderpath + '/'
      break;
    }
  }
  console.log('sending: ', `music/${filePath}${req.params.audio}`)
  res.set('Content-Type', 'audio/mpeg');
  res.sendFile(`music/${filePath}${req.params.audio}`, { root: './public' });
});

app.route('/api/tracklist/').get((req, res) => {
  res.send(musicOBJ);
});

// express-fileupload application.
app.post('/api/upload', function (req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e "sampleFile") is used to retrieve the uploaded file.
  let sampleFile = req.files.sampleFile;
  movefile(sampleFile, res);

  console.log('sending 201 status')
  // return res.status(201).send('file upload sucess');
  // return res.status(201);
});

function movefile(sampleFile, res) {
  // use the mv() method to place the file somewhere on your server.
  sampleFile.mv(`./public/music/${sampleFile.name}`, function (err) {
    console.log('file moving', sampleFile);
    if (err) {
      return res.status(500).send(err);
    }
    // checks the file size
    let stats = fs.statSync(`./public/music/${sampleFile.name}`);
    let fileSizeInBytes = stats.size;

    musicList = fs.readdirSync('public/music');
    scanFolder();
    console.log('file move complete')
    // return res.status(201).send('file upload sucess');
    return res.status(201).send(`${sampleFile.name} Uploaded!  ${fileSizeInBytes} Bytes`);
    // return res.sendStatus(200);
  });
}

app.listen(PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.')
  console.log('Server started:', new Date());
  console.log('Currently running on', serverVersion)
})

// Admin console commands
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input === 'print list') {
    console.log(musicList);
  } else if (input === 'scan folder') {
    scanFolder();
  } else if (input === 'version') {
    console.log(serverVersion);
  } else if (input === 'update') {
   update(); 
  } else if (input === 'p') {
    update(); 
  } else {
    console.log(input, 'is not a valid input')
  };
});

// update from github master
function update(){
  cmd.get('git pull origin master'),
  function (err, data, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  }
  cmd.get('npm install -y'),
  function (err, data, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  }
}


// Process files and folders.
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
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
        }
      });
    });
  });
};

function scanFolder() {
  walk(dir, function (err, results) {
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
        };
      }
      processed.push(processing.join('+'));
    }
    musicList = processed
    saveToJSON(musicList);
  });
}

function saveToJSON(fileList) {
  let toObject = [];
  for (let i = 0; i < fileList.length; i++) {
    let folderFileSplit = fileList[i].split('+');
    let fileName = folderFileSplit[folderFileSplit.length - 1];
    folderFileSplit.pop();
    let folderPath = folderFileSplit.join('/');
    let metaData = {};

    let file = {
      filename: fileName,
      folderpath: folderPath,
      metadata: metaData,
    }

    toObject.push(file);
  }

  musicOBJ = JSON.stringify(toObject)
  fs.writeFile("./public/master-list.json", JSON.stringify(toObject), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

scanFolder();
module.exports = musicOBJ;