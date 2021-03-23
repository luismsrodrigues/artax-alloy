const CONFIG = {
  API: {
    Address: "",
    Token: ""
  }
}

$( document ).ready(async function() {
  let serviceLoginResponse = await $.ajax({
    type: "GET",
    url: `/service/login`
  });

  CONFIG.API.Token = serviceLoginResponse.token;
});


// return;
// const BUTTON_CLOSE_CSGO = $("#csgo-close");
// const BUTTON_CONNECT_CSGO = $("#csgo-connect");
// const BUTTON_STREAM_MAIN = $("#stream-main");
// const BUTTON_RELOAD_OBS = $("#reload-obs");

// const INPUT_CSGO_IP = $("#csgo-ip");

// let OBS_STATE = {
//   Running: false,
//   Connected: false,
//   Streaming: false,
// };

// var socket = io(API, {
//   auth: {
//     token: token
//   },
// });

// socket.on("disconnect", (reason) => {
//   alert("SESSION NOT VALID ANYMORE");
// });

// socket.on('obsState', function(data) {
//   OBS_STATE = JSON.parse(data);

//   if(!OBS_STATE.Running || !OBS_STATE.Connected){
//     BUTTON_STREAM_MAIN.html("START STREAMING");
//     BUTTON_STREAM_MAIN.attr("disabled", true);
//   }else{
//     BUTTON_STREAM_MAIN.attr("disabled", false);
//   }

//   if(OBS_STATE.Streaming){
//     BUTTON_STREAM_MAIN.html("STOP STREAMING");
//   }else{
//     BUTTON_STREAM_MAIN.html("START STREAMING");
//   }
  
//   console.log(OBS_STATE);
// });

// socket.on('csgoState', function(data) {
//   const CSGO_STATE = JSON.parse(data);

//   if(CSGO_STATE.Running){
//     BUTTON_CONNECT_CSGO.html("CONNECTED").attr("disabled", true);
//     INPUT_CSGO_IP.val(CSGO_STATE.Ip);
//     BUTTON_CLOSE_CSGO.attr("disabled", false);
//   }else{
//     BUTTON_CONNECT_CSGO.html("CONNECT").attr("disabled", false);
//     BUTTON_CLOSE_CSGO.attr("disabled", true);
//   }

//   console.log(CSGO_STATE);
// });

// socket.on('globalState', function(data) {
//   const GLOBAL_STATE = JSON.parse(data);

//   console.log(GLOBAL_STATE);
// });


// BUTTON_RELOAD_OBS.on("click", function () {
//   $.ajax({
//     type: "GET",
//     url: `${API}/api/obs/stop`,
//     headers: {
//       "Authorization": "Bearer " + token
//     },
//     success: function (){
//       $.ajax({
//         type: "GET",
//         url: `${API}/api/obs/start`,
//         headers: {
//           "Authorization": "Bearer " + token
//         },
//         success: function (){
//         }
//       });
//     }
//   });
// });

// BUTTON_STREAM_MAIN.on("click", function () {
//   if(OBS_STATE.Streaming){
//     $.ajax({
//       type: "GET",
//       url: `${API}/api/obs/stream/stop`,
//       headers: {
//         "Authorization": "Bearer " + token
//       },
//       success: function (){}
//     });
//   }else{
//     $.ajax({
//       type: "GET",
//       url: `${API}/api/obs/stream/start`,
//       headers: {
//         "Authorization": "Bearer " + token
//       },
//       success: function (){}
//     });
//   }
// });

// BUTTON_CONNECT_CSGO.on("click", function () {
//   $.ajax({
//     type: "GET",
//     url: `${API}/api/game/start/csgo?ip=${INPUT_CSGO_IP.val()}`,
//     headers: {
//       "Authorization": "Bearer " + token
//     },
//     success: function (){},
//     error: function(xhr,status,message) {
//       alert(JSON.parse(xhr.responseText).errorMessage);
//   }
//   });
// });

// BUTTON_CLOSE_CSGO.on("click", function () {
//   $.ajax({
//     type: "GET",
//     url: `${API}/api/game/stop/csgo`,
//     headers: {
//       "Authorization": "Bearer " + token
//     },
//     success: function (){}
//   });
// });

// function setWidth(getFromThis, putOnThis){
//   var pageWidth = document.getElementById(getFromThis).offsetWidth;
//   var pageHeight = (pageWidth*9)/16;
//   document.getElementById(putOnThis).style.height = pageHeight;
//   document.getElementById(putOnThis).style.width = pageWidth;
// }