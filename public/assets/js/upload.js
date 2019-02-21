'use strict';

let fileSize = 0;
let fileSymb = '';
let uploadProgress = 0;

// alert(<button>test button</button>)
$('#uploadForm').bind('change', function () {
  // clear file info when new file is selected
  document.getElementById("fileInfo").innerHTML = "";
  // sets upload url dynamically based on server connection
  // document.getElementById("uploadForm").action = window.location.href + '/api/upload'
  document.getElementById("uploadForm").action = '/api/upload'

  // gets file information
  let uploadFileName = this[0].files[0].name;
  let uploadFileSize = this[0].files[0].size;
  let uploadFileType = this[0].files[0].type;
  let uploadFileModified = this[0].files[0].lastModifiedDate;
  // console.log(uploadFileName);
  // console.log(uploadFileSize);
  // console.log(uploadFileType);
  // console.log(uploadFileModified);
  // Adds decimal precision to Math.Round
  function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };
  // Calculates a more readable output for file size.
  let sizes = [Math.pow(1024, 6), Math.pow(1024, 5), Math.pow(1024, 4), Math.pow(1024, 3), Math.pow(1024, 2), 1024];
  let symbols = ['PB', 'TB', 'GB', 'MB', 'KB', 'B'];
  for (let j = 0; j <= sizes.length; j++) {
    if (uploadFileSize <= sizes[j]) {
      fileSymb = symbols[j];
    };
    if (uploadFileSize >= sizes[j]) {
      fileSize = precisionRound(uploadFileSize / sizes[j], 2);
      break;
    };
  };
  let fileInfo = [
    `File Name: ${uploadFileName}`,
    `File Size: ${fileSize} ${fileSymb}`,
    `File Type: ${uploadFileType}`,
    `Last Modified: ${uploadFileModified}`
  ];
  for (let i = 0; i < fileInfo.length; i++) {
    let liEm = document.createElement("li");
    let info = document.createTextNode(fileInfo[i]);
    liEm.appendChild(info);
    document.getElementById("fileInfo").appendChild(liEm);
  };
  return false;
});

function uploadMonitor() {
  document.getElementById("progressBar").value = "75";
  uploadComplete();
};

function uploadComplete() {
  document.getElementById("progressBar").value = "100";
  document.getElementById("fileInfo").innerHTML = "";
  let liEm = document.createElement("li");
  let info = document.createTextNode("Upload Complete!");
  liEm.appendChild(info); playedList
  document.getElementById("fileInfo").appendChild(liEm);
};

$('#uploadYouTube').bind('change', function () {
  console.log('change detected')
  let url = document.getElementById("ytURL")
  console.log('change:', url.value);
  let name = document.getElementById("ytName")
  console.log('change:', name.value);
  let folder = document.getElementById("ytFolder")
  console.log('change:', folder.value);

  // let toBase64 = btoa(url);
  // console.log('url to base64:', toBase64)
  document.getElementById("uploadYouTube").action = `/api/ytupload`
});