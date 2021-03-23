const CONFIG = {
  API: {
    Address: "",
    Token: ""
  },
  WSS:{
    Address: ""
  }
}

const CSGO_STATUS_REF = $("#csgo_status");
const OBS_STATUS_REF = $("#obs_status");
const OVERLAY_REF = $("#overlay");
const ALERT_REF = $("#alert");

const STATUS_TYPE = {
  Primary: "badge-primary",
  Secondary: "badge-secondary",
  Success: "badge-success",
  Danger: "badge-danger",
  Warning: "badge-warning",
  Info: "badge-info",
  Light: "badge-light",
  Dark: "badge-dark"
}

const ALERT_TYPES = {
  Success: "alert-success",
  Error: "alert-danger",
  Info: "alert-info"
};
const Components = {
  Alert: {
    SetType: function (type) {
      for(const property in ALERT_TYPES){
        ALERT_REF.removeClass(ALERT_TYPES[property]);
      }
      
      ALERT_REF.addClass(type);
      return this;
    },
    SetMessage: function(message){
      ALERT_REF.html(message);
      return this;
    },
    Show: function () {
      ALERT_REF.show();
      return this;
    },
    Hide: function () {
      ALERT_REF.attr('style', 'display: none !important; margin: 0;');
      return this;
    },
    TimeOut: function (time) {
      setTimeout(() => {
        console.log(this);
          this.Hide();
      }, time);
      return this;
    }
  },
  Overlay: {
    Show: function () {
      OVERLAY_REF.show();
      return this;
    },
    Hide: function () {
      OVERLAY_REF.hide();
      return this;
    }
  },
  Status: {
    Running: function (ref) {
      for(const property in STATUS_TYPE){
        ref.removeClass(STATUS_TYPE[property]);
      }
      ref.html("Running");
      ref.addClass(STATUS_TYPE.Success);
    },
    NotRunning: function (ref) {
      for(const property in STATUS_TYPE){
        ref.removeClass(STATUS_TYPE[property]);
      }
      ref.html("Not Running");
      ref.addClass(STATUS_TYPE.Danger);
    },
    Connected: function (ref) {
      for(const property in STATUS_TYPE){
        ref.removeClass(STATUS_TYPE[property]);
      }
      ref.html("Connected");
      ref.addClass(STATUS_TYPE.Success);
    },
    Disconnected: function (ref) {
      for(const property in STATUS_TYPE){
        ref.removeClass(STATUS_TYPE[property]);
      }
      ref.html("Disconnected");
      ref.addClass(STATUS_TYPE.Danger);
    },
    Nothing: function (ref) {
      for(const property in STATUS_TYPE){
        ref.removeClass(STATUS_TYPE[property]);
      }
      ref.html("Nothing");
      ref.addClass(STATUS_TYPE.Danger);
    },
    CustomMessageSuccess:function (ref, message) {
      for(const property in STATUS_TYPE){
        ref.removeClass(STATUS_TYPE[property]);
      }
      ref.html(message);
      ref.addClass(STATUS_TYPE.Success);
    },
  }
}

$( document ).ready(async function() {
  let serviceLoginResponse = null;
  Components.Alert.Hide();

  try {
    serviceLoginResponse = await $.ajax({ 
      type: "GET",
      url: `/service/login`
    }); 
  } catch (error) {
    if(error.responseJSON.type === "ECONNREFUSED"){
      Components.Alert
        .SetType(ALERT_TYPES.Error)
        .SetMessage(error.responseJSON.message)
        .Show();
      
      Components.Overlay.Show();
    }
    return;
  }

  CONFIG.API.Token = serviceLoginResponse.token;

  let configResponse = await $.ajax({ 
    type: "GET",
    url: `/service/config`
  }); 

  Components.Status.Nothing(CSGO_STATUS_REF);
  Components.Status.Nothing(OBS_STATUS_REF);

  CONFIG.API.Address = configResponse.api_path;
  CONFIG.WSS.Address = configResponse.wss_path;

  const SOCKET = io(CONFIG.WSS.Address, {
    auth: {
      token: CONFIG.API.Token
    },
  });

  SOCKET.on("connect", () => {
    Components.Alert
      .SetType(ALERT_TYPES.Success)
      .SetMessage("Connected to service.")
      .Show()
      .TimeOut(4000);

    Components.Overlay.Hide();
  });

  SOCKET.on("disconnect", (reason) => {
    Components.Alert
      .SetType(ALERT_TYPES.Error)
      .SetMessage("Service is down.")
      .Show();
  
    Components.Overlay.Show();
  });

  let OBS_STATE = {
    Running: false,
    Connected: false,
    Streaming: false,
  };

  const BUTTON_CLOSE_CSGO = $("#csgo-close");
  const BUTTON_CONNECT_CSGO = $("#csgo-connect");
  const BUTTON_STREAM_MAIN = $("#stream-main");
  const BUTTON_RELOAD_OBS = $("#reload-obs");

  const INPUT_CSGO_IP = $("#csgo-ip");

  SOCKET.on('obsState', function(data) {
    OBS_STATE = JSON.parse(data);

    if(!OBS_STATE.Running || !OBS_STATE.Connected){
      BUTTON_STREAM_MAIN.html("START STREAMING");
      BUTTON_STREAM_MAIN.attr("disabled", true);
    }else{
      BUTTON_STREAM_MAIN.attr("disabled", false);
    }

    if(OBS_STATE.Streaming){
      BUTTON_STREAM_MAIN.html("STOP STREAMING");
      BUTTON_STREAM_MAIN.removeClass("btn-danger");
      BUTTON_STREAM_MAIN.addClass("btn-success");
    }else{
      BUTTON_STREAM_MAIN.html("START STREAMING");
      BUTTON_STREAM_MAIN.removeClass("btn-success");
      BUTTON_STREAM_MAIN.addClass("btn-danger");
    }

    if(OBS_STATE.Running){
      Components.Status.Running(OBS_STATUS_REF);
    }else{
      Components.Status.NotRunning(OBS_STATUS_REF);
      return;
    }

    if(OBS_STATE.Connected){
      Components.Status.Connected(OBS_STATUS_REF);
    }else{
      Components.Status.Disconnected(OBS_STATUS_REF);
      return;
    }

    if(OBS_STATE.Streaming){
      Components.Status.CustomMessageSuccess(OBS_STATUS_REF, "Streaming");
    }
  });

  SOCKET.on('csgoState', function(data) {
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

  SOCKET.on('previewScreen', function(data) {
    $("#previewLive").attr("src", data[0].img);
  });

  function startPreload($this) {
    var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> ' +$this.html();
    $this.data('original-text', $this.html());
    $this.html(loadingText);
  }

  function stopPreload($this) {
    $this.html($this.data('original-text'));
  }

  BUTTON_RELOAD_OBS.on("click", function () {
    let $this = $(this);
    startPreload($this);
    $.ajax({
      type: "GET",
      url: `${CONFIG.API.Address}/obs/stop`,
      headers: {
        "Authorization": "Bearer " + CONFIG.API.Token
      },
      success: async function (){
        await $.ajax({
          type: "GET",
          url: `${CONFIG.API.Address}/obs/start`,
          headers: {
            "Authorization": "Bearer " + CONFIG.API.Token
          }});
      },
      complete:function () {
        stopPreload($this);
      }
    });
  });

  BUTTON_CLOSE_CSGO.on("click", function () {
    let $this = $(this);
    startPreload($this);
    $.ajax({
      type: "GET",
      url: `${CONFIG.API.Address}/game/stop/csgo`,
      headers: {
        "Authorization": "Bearer " + CONFIG.API.Token
      },
      complete:function () {
        stopPreload($this);
      }
    });
  });

  BUTTON_CONNECT_CSGO.on("click", function () {
    let $this = $(this);
    startPreload($this);
    $.ajax({
      type: "GET",
      url: `${CONFIG.API.Address}/game/start/csgo?ip=${INPUT_CSGO_IP.val()}`,
      headers: {
        "Authorization": "Bearer " + CONFIG.API.Token
      },
      success: function (){},
      error: function(xhr,status,message) {
        alert(JSON.parse(xhr.responseText).errorMessage);
      },
      complete:function () {
        stopPreload($this);
      }
    });
  });

  BUTTON_STREAM_MAIN.on("click", function () {
    if(OBS_STATE.Streaming){
      $.ajax({
        type: "GET",
        url: `${CONFIG.API.Address}/obs/stream/stop`,
        headers: {
          "Authorization": "Bearer " + CONFIG.API.Token
        },
        success: function (){}
      });
    }else{
      $.ajax({
        type: "GET",
        url: `${CONFIG.API.Address}/obs/stream/start`,
        headers: {
          "Authorization": "Bearer " + CONFIG.API.Token
        },
        success: function (){}
      });
    }
  });
});