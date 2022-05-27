const video = document.getElementById("video");
let track = {};

const imgdata = document.getElementById("img1");
function getBase64Image(img, width, height) {
  const canvas = document.createElement("canvas");

  canvas.width = width || img.width;

  canvas.height = height || img.height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL();

  return dataURL;
}

console.log(getBase64Image(imgdata));
function getMedia() {
  let constraints = {
    video: {
      width: 600,
      height: 400,
    },
    audio: true,
  };
  navigator = navigator.mediaDevices;
  navigator.getMedia =
    navigator.getUserMedia ||
    navagator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  let media = navigator.mediaDevices.getUserMedia(constraints);
  media.then(function (data) {
    video.srcObject = data;
    video.play();
    //将打开的摄像头和麦克风保存，方便后面关闭
    track = data.getTracks();
    console.log(data);
  });
  console.log(media);
}
function getImg() {
  let canvas = document.getElementById("canvas");
  let txv = canvas.getContext("2d");
  txv.drawImage(video, 0, 0, 600, 400);
  console.log(canvas.toDataURL());
  //遍历关闭摄像头
  for (let i of track) {
    i.stop();
  }
}
