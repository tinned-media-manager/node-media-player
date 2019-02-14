'use strict';
let url = window.location.href
let audioAPI = "api/audio/"
let trackAPI = "api/tracklist/"
let trackList = [];
let played = 0;
let playedList = [];
let shuffle = false;

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
  playedList.pop()
  let backTrack = {filename: playedList[playedList.length - 1]};
  // console.log('Going back to:', backTrack);
  playTrack(backTrack);
  playedList.pop()
}

let pauseTrack = document.getElementById("pause")
pauseTrack.onclick = function () {
  if (audioPlayer.paused && audioPlayer.currentTime > 0 && !audioPlayer.ended) {
    audioPlayer.play();
    document.getElementById("pause").innerHTML = "Pause"
  } else {
    audioPlayer.pause();
    document.getElementById("pause").innerHTML = "Play"
  }
}

let playMode = document.getElementById("mode")
playMode.onclick = function () {
  shuffle = !shuffle
  if (shuffle === true) {
    document.getElementById("mode").innerHTML = "List"
  } else {
    document.getElementById("mode").innerHTML = "Random"
  }
}

function domTrackList() {
  for (let i = 0; i < trackList.length; i++) {
    let liEm = document.createElement("li");
    let info = document.createTextNode(trackList[i].filename.split('.')[0]);
    liEm.appendChild(info);
    document.getElementById("track-list").appendChild(liEm);
  };
};


window.onload = function () {
  chooseTrack();
  domTrackList()
};

setTimeout(() => {
  audioPlayer.play();
}, 500)