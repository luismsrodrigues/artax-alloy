var socket = io("http://localhost:12080", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE2MTQ5MDcxMDQsImV4cCI6MTYxNDkxMjEwNH0.t0BATDYV8OZKQ9dEJlZjMXi2u93v7G69zMX-slNSd4I"
  },
});

const LIVE_CARD = $("#live-card");
const PREVIEW_CARD = $("#preview-card");

socket.on('previewScreen', function(data) {
  document.querySelector('#currentScene').src = data.img;
});

socket.on('previewNextScreen', function(data) {
  document.querySelector('#previewScene').src = data.img;
});

socket.on('state', function(data) {
  console.log(data);
});

socket.on('obsState', function(data) {
  const OBS_STATE = JSON.parse(data);

  console.log(OBS_STATE);
});

socket.on('globalState', function(data) {
  const GLOBAL_STATE = JSON.parse(data);

  console.log(GLOBAL_STATE);

  switch (GLOBAL_STATE.DisplayActive) {
    case "PREVIEW":
      LIVE_CARD.hide();
      PREVIEW_CARD.show();
      break;
    case "LIVE":
    default:
      LIVE_CARD.show();
      PREVIEW_CARD.hide();
      break;
  }
});

$('.my-select').selectpicker();