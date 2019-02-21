# Self hosted streaming music service.

## MP3 music files are stored in the public/muic folder

## Dependencys
sudo apt-get install ffmpeg

## Functionallity
- [X] Basic music player that can play a list of MP3's.
- [X] Set up API to host files to music player.
- [X] Set up API to send track list.
- [X] Set server to check if public/music folder exists, if not create it.
- [X] Next button to play next track.
- [X] Play/Pause button function.
- [X] List or Shuffle button function.
- [X] Add file upload button and function to add music.
- [X] Prevent page from reloading after file upload.
- [X] Client refresh track list after file upload completes.
- [X] Upload tries to navigate to /upload so long after upload completes and crashes site.
- [ ] Server side playlist management.
- [X] Put folder san into function that runs at page load but can be called again latter.
- [ ] Monitor music folder for changes and update master playlist.
- [X] Put upload form inside of allert or pop up window of some type.
- [ ] Functionality to upload multiple files.
- [ ] Functionality drag and drop file upload.
- [X] File scanner that supports nested folders.
- [X] Previous track functionality.
- [X] Style buttons with font-awesome.
- [X] Mobile lock screen controls.
- [X] Command line module for live updating.
- [X] Complete set of basic custom controls.
- [X] Keyboard shortcut controls.
- [X] Prevent repeat plays within an ammount of plays for random.
- [X] Restart track from beginning function.
- [X] Download and extract audio from youtube.
- [X] Custom file name and folder for youtube audio.
- [X] Refactor code to modules.

## resources
- https://fontawesome.com/icons?d=gallery&c=audio-video&m=free
- https://developers.google.com/web/updates/2017/02/media-session
- https://www.npmjs.com/package/youtube-mp3-downloader

## YT audio to download
- https://www.youtube.com/watch?v=nk1dsHFOEy8&list=RDg2_chjr4Zmo&index=27