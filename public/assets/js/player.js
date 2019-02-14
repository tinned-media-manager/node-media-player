'use strict';
let url = window.location.href
let audioAPI = "api/audio/"
let trackAPI = "api/tracklist/"
let trackList = [];
let played = 0;
let playedList = [];
let shuffle = true;
let currentTrack = {};

$.get(window.location.href + trackAPI, function (data) {
  trackList = JSON.parse(data);
});

let audioPlayer = document.getElementById("audio-player")
audioPlayer.addEventListener("ended", function () {
  audioPlayer.currentTime = 0;
  chooseTrack();
});

let playTrack = function (track) {
  document.getElementById("playing-track").innerHTML = track.filename.split('.')[0];
  document.getElementById("current").src = url + audioAPI + track.filename
  playedList.push(track.filename);
  currentTrack = track;
  // console.log(playedList);
  audioPlayer.load();
  played++
};

let chooseTrack = function () {
  if (shuffle === true) {
    random();
  } else {
    playlist();
  }
};

let playlist = function () {
  // console.log(trackList[played])
  playTrack(trackList[played]);
  if (played === trackList.length) { played = 0 }
}

let random = function () {
  let playing = Math.floor(Math.random() * trackList.length)
  playTrack(trackList[playing]);
}

let nextTrack = document.getElementById("next")
nextTrack.onclick = function () {
  chooseTrack();
};

let previousTrack = document.getElementById("previous")
previousTrack.onclick = function () {
  playPreviousTrack();
}

function playPreviousTrack(){
  playedList.pop()
  let backTrack = {filename: playedList[playedList.length - 1]};
  // console.log('Going back to:', backTrack);
  playTrack(backTrack);
  playedList.pop()
}

let pauseTrack = document.getElementById("pause")
pauseTrack.onclick = function () {
  playPauseTrack();
}

function playPauseTrack() {
  if (audioPlayer.paused && audioPlayer.currentTime > 0 && !audioPlayer.ended) {
    audioPlayer.play()
    .then(_ => { navigator.mediaSession.setActionHandler('play', function() {}) })
    .catch(error => { console.log(error) });;
    document.getElementById("pause").innerHTML = '<i class="fas fa-pause"></i>'
  } else {
    audioPlayer.pause();
    document.getElementById("pause").innerHTML = '<i class="fas fa-play"></i>'
  }
}

let playMode = document.getElementById("mode")
playMode.onclick = function () {
  shuffle = !shuffle
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

let userSelectedTrack = document.getElementById("track-list");
userSelectedTrack.onclick = function (event) {
  // console.log(event.target.id);
  for (let i = 0; i < trackList.length; i++) {
    if(event.target.id === trackList[i].filename) {
      // console.log('file to play found!:', trackList[i].filename)
      playTrack(trackList[i]);
    }
  }
}


window.onload = function () {
  chooseTrack();
  domTrackList()
};

setTimeout(() => {
  audioPlayer.play();
}, 500)

$(document).ready(function() {
  $('#track-list').click(function() {
      var href = $(this).find("a").attr("href");
      if(href) {
          window.location = href;
      }
  });
  $('#track-list').hover(function() {
    $(this).css('cursor','pointer')
  });
});


// https://developers.google.com/web/updates/2017/02/media-session
if ('mediaSession' in navigator) {
// let trackTitle = currentTrack.filename.split(' - ')[1];
let trackTitle = 'title';
  navigator.mediaSession.metadata = new MediaMetadata({
    title: trackTitle,
    // artist: currentTrack.filename.split(' - ')[0],
    // title: 'title',
    artist: 'artist',
    // album: 'album',
    // artwork: [
    //   { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
    //   { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
    //   { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
    //   { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
    //   { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
    //   { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
    // ]
  });

  navigator.mediaSession.setActionHandler('play', function() {
    playPauseTrack();
  });
  navigator.mediaSession.setActionHandler('pause', function() {
    playPauseTrack();
  });
  // navigator.mediaSession.setActionHandler('seekbackward', function() {});
  // navigator.mediaSession.setActionHandler('seekforward', function() {});
  navigator.mediaSession.setActionHandler('previoustrack', function() {
    playPreviousTrack();
  });
  navigator.mediaSession.setActionHandler('nexttrack', function() {
    chooseTrack();
  });
}