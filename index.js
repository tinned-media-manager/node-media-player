'use strict';

const fs = require('fs');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

var dir = './public/music';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let musicList = fs.readdirSync('public/music');

// static files
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: './public' });
})

app.route('/api/audio/:audio').get((req, res) => {
  console.log('Track requested:', req.params.audio);
  res.set('Content-Type', 'audio/mpeg');
  res.sendFile(`music/${req.params.audio}`, { root: './public' });
});

app.route('/api/tracklist/').get((req, res) => {
  res.send(musicList);
});

// express-fileupload application.
app.post('/upload', function (req, res) {
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
    // let stats = fs.statSync(`./public/music/${sampleFile.name}`);
    // let fileSizeInBytes = stats.size;

    // res.send(`${sampleFile.name} Uploaded!  ${fileSizeInBytes} Bytes`);
    musicList = fs.readdirSync('public/music');
    // res.sendFile(__dirname + '/public/index.html');
    // res.sendFile('public/index.html', { root: './public' });
    // res.send(uploadComplete());
    console.log('file move complete')
    // return res.status(201).send('file upload sucess');
    return res.sendStatus(200);
  });
}

app.listen(PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.')
})


// console.log(music);

// let musicList = JSON.stringify(music)
// console.log(musicList);

// works but is deprecaited and causes app to crash
// fs.writeFile('./data.json', JSON.stringify(music, null, 2) , 'utf-8');
