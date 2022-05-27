let ws = {};
let token = "";
let isRead = false;
//获取token
$.ajax({
  url: "http://106.52.89.136:8000/getToken",
  success: function (result) {
    token = result;
  },
});

const btnFan = document.getElementById("btnFan");
const btnMusic = document.getElementById("btnMusic");
const btnBed = document.getElementById("btnBed");
const bedImg = document.getElementById("bedImg");

function mySend(conn) {
  ws.send(conn);
}
let dataIndex = 0;
let dataValue = "";
const changeIgmage = (angle) => {
  let x = angle / 16000;
  x *= 90;
  bedImg.style.transform = "rotate(" + x + "deg)";
};

//添加连接的点击事件
document.getElementById("btn").onclick = function () {
  console.log(1);
  let url = `wss://cloud.alientek.com/session/${token}/org/1352/connection/14424?token=${token}`;
  ws = new WebSocket(url);
  //连接成功函数
  ws.onopen = function () {
    console.log("连接成功！");
  };
  //接受数据函数
  ws.onmessage = function (event) {
    let rd = new FileReader();
    rd.readAsText(event.data, "gb2312");
    rd.onload = function () {
      let msg = rd.result;
      msg = msg.replace(/\r\n/g, "");
      if (dataIndex % 2) {
        if (dataValue[0] == "T") msg = dataValue + msg;
        else msg = msg + dataValue;
        dataIndex = 0;
      } else {
        dataValue = msg;
        dataIndex++;
        return;
      }
      let data = msg.split(",");
      data = data.slice(0, 6);
      let ob = {};
      for (let i of data) {
        let mid = i.split(":");
        ob[mid[0]] = mid[1];
      }
      if (ob["Temperature"]) appendMsg(ob);
    };
  };
};
function appendMsg(txt) {
  let temperature = document.getElementById("temperature");
  let humidity = document.getElementById("humidity");
  changeIgmage(txt["Angle"]);
  if (isRead) return;
  temperature.innerText = `${txt["Temperature"]}`;
  humidity.innerText = `${txt["Humidity"]}`;
  if (txt["fengshan"] != "off") {
    btnFan.className = "no";
    btnFan.innerText = "关闭";
  } else if (txt["fengshan"] != "no") {
    btnFan.className = "off";
    btnFan.innerText = "开启";
  }
  if (txt["music"].slice(0, 3) != "off") {
    btnMusic.className = "no";
    btnMusic.innerText = "关闭";
  } else if (txt["music"] != "no") {
    btnMusic.className = "off";
    btnMusic.innerText = "开启";
  }
  if (txt["yaochuang"] != "off") {
    btnBed.className = "no";
    btnBed.innerText = "关闭";
  } else if (txt["yaochuang"] != "no") {
    btnBed.className = "off";
    btnBed.innerText = "开启";
  }
  isRead = true;
}

//风扇回调
const callbake1 = (x) => {
  if (x) {
    console.log("开启风扇");
    document.getElementById("fan").className += " rotate";
    mySend("e");
  } else {
    document.getElementById("fan").className = "imgDiv";
    console.log("关闭风扇");
    mySend("f");
  }
};
//音乐回调
const callbake2 = (x) => {
  if (x) {
    console.log("开启音乐");
    mySend("c");
  } else {
    console.log("关闭音乐");
    mySend("d");
  }
};
const callback3 = (x) => {
  if (x) {
    console.log("开启摇床");
    mySend("a");
  } else {
    console.log("关闭摇床");
    mySend("b");
  }
};
//点击事件
const changeOff = (callback) => {
  return (e) => {
    if (!isRead) {
      document.getElementById("tishi").style.opacity = "1";
      document.getElementById("tishi").style.visibility = "visible";
      setTimeout(() => {
        document.getElementById("tishi").style.opacity = "0";
        document.getElementById("tishi").style.visibility = "hidden";
      }, 2000);
      return;
    }
    let div = e.target;
    if (div.className != "no") {
      div.className = "no";
      div.innerText = "关闭";
      isOff = true;
      callback(1);
    } else {
      isOff = false;
      div.className = "off";
      div.innerText = "开启";
      callback(0);
    }
  };
};
btnFan.addEventListener("click", changeOff(callbake1));
btnMusic.addEventListener("click", changeOff(callbake2));
btnBed.addEventListener("click", changeOff(callback3));
