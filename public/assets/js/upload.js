fileSize = 0;
fileSymb = '';
uploadProgress = 0;

let uploadRequest = document.getElementById("extUpload");
uploadRequest.onclick = function () {
  alert("upload a file")
};

// alert(<button>test button</button>)
$('#uploadForm').bind('change', function () {
  // clear file info when new file is selected
  document.getElementById("fileInfo").innerHTML = "";
  // sets upload url dynamically based on server connection
  document.getElementById("uploadForm").action = window.location.href + 'upload'
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
  sizes = [Math.pow(1024, 6), Math.pow(1024, 5), Math.pow(1024, 4), Math.pow(1024, 3), Math.pow(1024, 2), 1024];
  symbols = ['PB', 'TB', 'GB', 'MB', 'KB', 'B'];
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
  liEm.appendChild(info);
  document.getElementById("fileInfo").appendChild(liEm);
};