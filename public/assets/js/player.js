'use strict';
const url = window.location.href
const audioAPI = "api/audio/"
const trackAPI = "api/tracklist/"
let trackList = [];
let played = 0;
let playedList = [];
let shuffle = true;
let currentTrack = {};
let volume = 1;
let noRepeat = 10

// Gets the full track list from server API
$.get(window.location.href + trackAPI, function (data) {
  trackList = JSON.parse(data);
});

// Player functions
let playTrack = function (track) {
  document.getElementById("playing-track").innerHTML = track.filename.split('.')[0];
  document.getElementById("current").src = url + audioAPI + track.filename
  playedList.push(track.filename);
  currentTrack = track;
  setMetadata();
  audioPlayer.load();
  played++
};

function chooseTrack() {
  if (shuffle === true) {
    random();
  } else {
    playlist();
  }
};

function playlist() {
  playTrack(trackList[played]);
  if (played === trackList.length) { played = 0 }
}

function random() {
  let playing = Math.floor(Math.random() * trackList.length)
  if (playedList.length > noRepeat){
    for (let i = playedList.length - noRepeat; i < playedList.length; i++){
      if (trackList[playing].filename === playedList[i]){
        playing = Math.floor(Math.random() * trackList.length)
      }
    }
  }
  playTrack(trackList[playing]);
}

function playPreviousTrack() {
  playedList.pop()
  let backTrack = { filename: playedList[playedList.length - 1] };
  playTrack(backTrack);
  playedList.pop()
}

function skipForward(){
  audioPlayer.currentTime = audioPlayer.currentTime + 10;
}

function rewindBack() {
  audioPlayer.currentTime = audioPlayer.currentTime - 10;
}

function volumeLevel() {
  let progress = document.getElementById("volume-level"); 
  let width = audioPlayer.volume * 100;
  progress.style.width = width + '%'; 
};

function audioVolumeUp() {
  if (audioPlayer.volume < 1) {
    audioPlayer.volume = audioPlayer.volume + .1;
  }
  volume = audioPlayer.volume;
  volumeLevel()
}

function audioVolumeDown() {
  if (audioPlayer.volume > .1){
    audioPlayer.volume = audioPlayer.volume - .1;
  }
  volume = audioPlayer.volume;
  volumeLevel()
}

function mute(){
  if (audioPlayer.volume === 0){
    audioPlayer.volume = volume;
    document.getElementById("volume-mute").innerHTML = '<i class="fas fa-volume-mute"></i>'
  } else {
    volume = audioPlayer.volume
    audioPlayer.volume = 0
    document.getElementById("volume-mute").innerHTML = '<i class="fas fa-volume-off"></i>'
  }
  volumeLevel()
}

function playPauseTrack() {
  if (audioPlayer.paused && audioPlayer.currentTime > 0 && !audioPlayer.ended) {
    audioPlayer.play();
    document.getElementById("pause").innerHTML = '<i class="fas fa-pause"></i>'
  } else {
    audioPlayer.pause();
    document.getElementById("pause").innerHTML = '<i class="fas fa-play"></i>'
  }
}

function modeButtonIcon () {
  if (shuffle === true) {
    document.getElementById("mode").innerHTML = '<i class="fas fa-list-ul"></i>'
  } else {
    document.getElementById("mode").innerHTML = '<i class="fas fa-random"></i>'
  }
}

function domTrackList() {
  for (let i = 0; i < trackList.length; i++) {
    let liEm = document.createElement("li");
    let info = document.createTextNode(trackList[i].filename.split('.')[0]);
    liEm.appendChild(info);
    document.getElementById("track-list").appendChild(liEm).id = trackList[i].filename;
  };
};

window.onload = function () {
  chooseTrack();
  modeButtonIcon();
  volumeLevel();
  setTimeout(() => {
    domTrackList();
    audioPlayer.play();
  }, 500);
};

// Webpage DOM controls
let audioPlayer = document.getElementById("audio-player")
audioPlayer.addEventListener("ended", function () {
  audioPlayer.currentTime = 0;
  chooseTrack();
});

let pauseTrack = document.getElementById("pause")
pauseTrack.onclick = function () {
  playPauseTrack();
}

let nextTrack = document.getElementById("next")
nextTrack.onclick = function () {
  chooseTrack();
};

let previousTrack = document.getElementById("previous")
previousTrack.onclick = function () {
  playPreviousTrack();
};

let forwardTrack = document.getElementById("forward")
forwardTrack.onclick = function () {
  skipForward();
}

let rewindTrack = document.getElementById("rewind");
rewindTrack.onclick = function () {
  rewindBack();
}

let volumeUp = document.getElementById("volume-up");
volumeUp.onclick = function () {
  audioVolumeUp();
}

let volumeDown = document.getElementById("volume-down");
volumeDown.onclick = function () {
  audioVolumeDown();
}

let volumeMute = document.getElementById("volume-mute");
volumeMute.onclick = function () {
  mute();
}

let playMode = document.getElementById("mode")
playMode.onclick = function () {
  shuffle = !shuffle
  modeButtonIcon();
}

let userSelectedTrack = document.getElementById("track-list");
userSelectedTrack.onclick = function (event) {
  for (let i = 0; i < trackList.length; i++) {
    if (event.target.id === trackList[i].filename) {
      playTrack(trackList[i]);
    };
  };
};

// Changes cursor from arrow to hand when hovering over music list on page.
$(document).ready(function () {
  $('#track-list').click(function () {
    var href = $(this).find("a").attr("href");
    if (href) {
      window.location = href;
    }
  });
  $('#track-list').hover(function () {
    $(this).css('cursor', 'pointer')
  });
});

// Keyboard controls
document.onkeydown = function (event) {
  if (event.keyCode === 32) { // Space Pause/Play
    playPauseTrack();
  } else if (event.keyCode === 39) { // Left Arrow fast forward
    skipForward();
  } else if (event.keyCode === 37) { // Right Arrow Rewind
    rewindBack();
  } else if (event.keyCode === 38) { // Up Arrow Volume Up
    audioVolumeUp();
  } else if (event.keyCode === 40) { // Down Arrow Volume Down
    audioVolumeDown();
  } else if (event.keyCode === 190) { // > Next Track
    chooseTrack();
  } else if (event.keyCode === 188) { // < Previous Track
    playPreviousTrack();
  }
};

// Mobile Controls
function setMetadata() {
  // https://developers.google.com/web/updates/2017/02/media-session
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.filename.split(' - ')[1].split('.')[0],
      artist: currentTrack.filename.split(' - ')[0],
      // album: 'album',
      artwork: [
        { src: 'music-note.png', sizes: '96x96', type: 'image/png' },
        // { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
        // { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
        // { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
        // { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
        // { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
      ]
    });

    navigator.mediaSession.setActionHandler('play', function () {
      playPauseTrack();
    });
    navigator.mediaSession.setActionHandler('pause', function () {
      playPauseTrack();
    });
    navigator.mediaSession.setActionHandler('seekbackward', function() {
      skipForward();
    });
    navigator.mediaSession.setActionHandler('seekforward', function() {
      rewindBack();
    });
    navigator.mediaSession.setActionHandler('previoustrack', function () {
      playPreviousTrack();
    });
    navigator.mediaSession.setActionHandler('nexttrack', function () {
      chooseTrack();
    });
  }
}


// Media player dynamic content
function trackProgressBar() {
  let progress = document.getElementById("track-progress-bar"); 
  let width = 0;
  width = Math.floor((audioPlayer.currentTime / audioPlayer.duration) * 100);
  progress.style.width = width + '%'; 
};

function toHHMMSS (secs) {
  var sec_num = parseInt(secs, 10)    
  var hours   = Math.floor(sec_num / 3600) % 24
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60    
  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":")
}

setInterval(function(){ 
  trackProgressBar()
  document.getElementById("track-time").innerHTML = `${toHHMMSS(audioPlayer.currentTime)} / ${toHHMMSS(audioPlayer.duration)}`;
}, 500);
