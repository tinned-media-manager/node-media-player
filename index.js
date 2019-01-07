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

// static files
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: './public' });

})

app.listen(PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.')
})