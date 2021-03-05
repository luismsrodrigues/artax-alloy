var socket = io("http://localhost:12080", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE2MTQ4OTcxNjAsImV4cCI6MTYxNDkwMjE2MH0.KfjXZPcyYpOTfKtFMO8QDvj3qRcLXoh9r8wzbtnb6hQ"
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