const DEBUG = require('debug')('OBS_INTEGRATION');
const OBSWebSocket = require('obs-websocket-js');

const State = require('./state');

module.exports = (CONFIGURATION, UTILS, GLOBAL_STATE) => {
    const obs = new OBSWebSocket();
    const OBS_EXE_NAME = "obs64.exe";
    const ACTIONS = {};
    var screenShots = null;

    async function ValidatePath() {
        return await UTILS.Directory.Exists(CONFIGURATION.Obs.Path);
    }
    
    function AddAction(actionName, action) {
        ACTIONS[actionName] = action;
    }

    async function sendCommand(command, params) {
        try {
          return await obs.send(command, params || {});
        } catch (e) {
            DEBUG('Error sending command', command, ' - error is:', e);
            throw e;
        }
    }

    async function IsRunning(){
        return await UTILS.Process.isRunning(OBS_EXE_NAME);
    }

    function screenShotActionStop() {
        if(CONFIGURATION.Modules.PreviewStream.Active){
            DEBUG("STOPED SCREEN SHOT ACTION");
            clearInterval(screenShots);
        }
    }

    async function updateScenes() {
        let currentData = await sendCommand('GetSceneList');
        let previewData = await sendCommand('GetPreviewScene');

        await State.SetByAction((oldState) =>{
            oldState.PreviewScene = previewData.name;
            oldState.CurrentScene = currentData.currentScene;
            return oldState;
        });
    }

    obs.on('ConnectionClosed', async () => {
        await State.Set({Connected: false});
        DEBUG('DISCONNECTED'); 
    });

    obs.on('AuthenticationSuccess', async () => {
        await State.Set({Connected: true});
        DEBUG('CONNECTED'); 
        
        let data = await sendCommand('GetStudioModeStatus');
        if(!data || !data.studioMode){
            await sendCommand('ToggleStudioMode');
        }

        DEBUG('STUDIO MOD'); 

        await sendCommand('SetHeartbeat', { enable: true });
        
        let result = await sendCommand('GetSceneList');
        let tempState = {
            Scenes: []
        };
        tempState.Scenes = result.scenes.map((scene) => scene.name);

        await State.Set(tempState);

        await updateScenes();
        
        await screenShotActionStart();
    });

    obs.on('SwitchScenes', async (data) => {
        await updateScenes();
    });

    obs.on('PreviewSceneChanged', async(data) => {
        await updateScenes();
      });

    obs.on('error', err => {
        DEBUG('SOCKET ERROR', err); 
    });
    async function connectToProgram() {
        DEBUG('CONNECTING'); 
        try {
            if(await IsRunning()){
                await obs.connect({ address: "localhost:4444", password: "123" });
                await State.Set({Connected: true});
            }else{
                DEBUG('OBS its not running.'); 
            }
        } catch (error) {
            DEBUG('Error on trying connect to OBS.');               
            await State.Set({Connected: false});
        }
    }

    async function stopProgram(){
        DEBUG("STOPING");
        
        if(await IsRunning()){
            let result = await UTILS.Process.stop(OBS_EXE_NAME);
            DEBUG(result);
        }else{
            DEBUG("NOT RUNNING");
        }
    }

    async function startProgram() {
        DEBUG("STARTING");

         if(await IsRunning()){
            DEBUG("ALL READY RUNNING");
         }else{
            await UTILS.Process.start(OBS_EXE_NAME).WithDirectory(process.env.OBS_PATH);
            await State.Set({Running: true});
            DEBUG("STARTED");
            await connectToProgram();
         }
    }

    async function getScreenshot() {
        if(CONFIGURATION.Modules.PreviewStream.Active){
            if(State.Get().Connected){
                let data = "";

                if(GLOBAL_STATE.Get().DisplayActive === "LIVE"){
                    data = await sendCommand('TakeSourceScreenshot', { sourceName: State.Get().CurrentScene, embedPictureFormat: 'png', width: 960, height: 540 });
                    if (data && data.img) {
                        ACTIONS["PreviewScreen"](data);
                    }
                }

                if(GLOBAL_STATE.Get().DisplayActive === "PREVIEW"){
                    data = await sendCommand('TakeSourceScreenshot', { sourceName: State.Get().PreviewScene, embedPictureFormat: 'png', width: 960, height: 540 });
                    if (data && data.img) {
                        ACTIONS["PreviewNextScreen"](data);
                    }
                }
            }
        }
    }

    async function screenShotActionStart() {
        if(CONFIGURATION.Modules.PreviewStream.Active){
            DEBUG("STARTED SCREEN SHOT ACTION");
            screenShots =  setInterval(await getScreenshot, 1000 / CONFIGURATION.Modules.PreviewStream.Fps);
        }
    }

    async function setNewPreviewScene(sceneName){
        if(!State.Get().Scenes.find(scene => scene == sceneName)){
            throw "Invalid scene name";
        }

        await State.Set({PreviewScene: sceneName});
        await getScreenshot();
    }

    async function setNewLiveScene(sceneName){
        if(!State.Get().Scenes.find(scene => scene == sceneName)){
            throw "Invalid scene name";
        }

        await State.Set({CurrentScene: sceneName});
        await getScreenshot();
    }

    async function startStream() {
        await State.Set({ Streaming: true});
        await sendCommand('StartStreaming');
    }

    async function stopStream() {
        await State.Set({ Streaming: false});
        await sendCommand('StopStreaming');
    }

    //State Effects
    State.AddEffect(async (oldState, newState) => {
        if(!newState.Running 
            || !newState.Connected){
            await screenShotActionStop();
        }
    });

    State.AddEffect(async (oldState, newState) => {
        let tempState = JSON.stringify(newState);
        DEBUG("STATE", JSON.stringify(tempState));
        if(ACTIONS["StateChange"]){
            await ACTIONS["StateChange"](tempState);
        }
    });

    State.AddEffect(async (oldState, newState) => {
        if(newState.CurrentScene 
            != oldState.CurrentScene){
                await sendCommand('SetCurrentScene', { 'scene-name': newState.CurrentScene });
        }
    });

    State.AddEffect(async (oldState, newState) => {
        if(newState.PreviewScene 
            != oldState.PreviewScene){
                await sendCommand('SetPreviewScene', { 'scene-name': newState.PreviewScene });
        }
    });

    return {
        GetState: () => State.Get(),

        Start: startProgram,
        Stop: stopProgram,
        Connect: connectToProgram,
        AddAction,

        StartStream: startStream,
        StopStream: stopStream,
        UpdateScenes: updateScenes,
        SetNewPreviewScene: setNewPreviewScene,
        SetNewLiveScene: setNewLiveScene,

        ValidatePath,
        CheckState: async function(){
            let isRunning = await IsRunning();
            await State.Set({Running: isRunning});
        }
    };
}