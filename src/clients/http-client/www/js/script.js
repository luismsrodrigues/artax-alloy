const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE2MTYxMDQzODYsImV4cCI6MTYxNjEwOTM4Nn0.AH0nXWnETIFCJcuzhXhPuhQR4vZ0q_Unt8_NRa3sw_Q";
const API = "http://localhost:12080";
const BUTTON_CLOSE_CSGO = $("#csgo-close");
const BUTTON_CONNECT_CSGO = $("#csgo-connect");
const BUTTON_STREAM_MAIN = $("#stream-main");
const BUTTON_RELOAD_OBS = $("#reload-obs");

const INPUT_CSGO_IP = $("#csgo-ip");

let OBS_STATE = {
  Running: false,
  Connected: false,
  Streaming: false,
};

var socket = io(API, {
  auth: {
    token: token
  },
});

socket.on("disconnect", (reason) => {
  alert("SESSION NOT VALID ANYMORE");
});

socket.on('obsState', function(data) {
  OBS_STATE = JSON.parse(data);

  if(!OBS_STATE.Running || !OBS_STATE.Connected){
    BUTTON_STREAM_MAIN.html("START STREAMING");
    BUTTON_STREAM_MAIN.attr("disabled", true);
  }else{
    BUTTON_STREAM_MAIN.attr("disabled", false);
  }

  if(OBS_STATE.Streaming){
    BUTTON_STREAM_MAIN.html("STOP STREAMING");
  }else{
    BUTTON_STREAM_MAIN.html("START STREAMING");
  }
  
  console.log(OBS_STATE);
});

socket.on('csgoState', function(data) {
  const CSGO_STATE = JSON.parse(data);

  if(CSGO_STATE.Running){
    BUTTON_CONNECT_CSGO.html("CONNECTED").attr("disabled", true);
    INPUT_CSGO_IP.val(CSGO_STATE.Ip);
    BUTTON_CLOSE_CSGO.attr("disabled", false);
  }else{
    BUTTON_CONNECT_CSGO.html("CONNECT").attr("disabled", false);
    BUTTON_CLOSE_CSGO.attr("disabled", true);
  }

  console.log(CSGO_STATE);
});

socket.on('globalState', function(data) {
  const GLOBAL_STATE = JSON.parse(data);

  console.log(GLOBAL_STATE);
});


BUTTON_RELOAD_OBS.on("click", function () {
  $.ajax({
    type: "GET",
    url: `${API}/api/obs/stop`,
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function (){
      $.ajax({
        type: "GET",
        url: `${API}/api/obs/start`,
        headers: {
          "Authorization": "Bearer " + token
        },
        success: function (){
        }
      });
    }
  });
});

BUTTON_STREAM_MAIN.on("click", function () {
  if(OBS_STATE.Streaming){
    $.ajax({
      type: "GET",
      url: `${API}/api/obs/stream/stop`,
      headers: {
        "Authorization": "Bearer " + token
      },
      success: function (){}
    });
  }else{
    $.ajax({
      type: "GET",
      url: `${API}/api/obs/stream/start`,
      headers: {
        "Authorization": "Bearer " + token
      },
      success: function (){}
    });
  }
});

BUTTON_CONNECT_CSGO.on("click", function () {
  $.ajax({
    type: "GET",
    url: `${API}/api/game/start/csgo?ip=${INPUT_CSGO_IP.val()}`,
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function (){},
    error: function(xhr,status,message) {
      alert(JSON.parse(xhr.responseText).errorMessage);
  }
  });
});

BUTTON_CLOSE_CSGO.on("click", function () {
  $.ajax({
    type: "GET",
    url: `${API}/api/game/stop/csgo`,
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function (){}
  });
});