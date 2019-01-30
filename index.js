'use strict';

const fs = require('fs');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var dir = __dirname + '/public/music';
if (!path.existsSync(dir)) {
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

app.listen(PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.')
})


// console.log(music);

// let musicList = JSON.stringify(music)
// console.log(musicList);

// works but is deprecaited and causes app to crash
// fs.writeFile('./data.json', JSON.stringify(music, null, 2) , 'utf-8');
