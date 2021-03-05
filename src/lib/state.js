
let STATE = {
    DisplayActive: ""
}

let EFFECTS = [];

function Equals(oldState, newState) {
    return JSON.stringify(oldState) === JSON.stringify(newState);
}

function GetState() {
    return STATE;
}

async function SetState(oldState, newState) {
    let tempOldState = Object.assign({}, oldState);
    STATE = Object.assign(tempOldState, newState);

    if(!Equals(oldState, STATE)){
        EFFECTS.forEach(async effect => {
            await effect(oldState, STATE);
        });
    }
}

module.exports = {
    Get: GetState,
    Set: async (newState) =>  SetState(Object.assign({}, STATE), newState),
    AddEffect: function (effect) {
        EFFECTS.push(effect);  
    },
}