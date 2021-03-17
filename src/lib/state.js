let STATE = {
    DisplayActive: "LIVE"
}

let EFFECTS = [];

function Equals(oldState, newState) {
    return JSON.stringify(oldState) === JSON.stringify(newState);
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

function GetState() {
    return STATE;
}

module.exports = {
    Get: GetState,
    Set: async (newState) => await SetState(Object.assign({}, STATE), newState),
    SetByAction: async (action) => await SetState(Object.assign({}, STATE), await action(Object.assign({}, STATE))),
    AddEffect: function (effect) {
        EFFECTS.push(effect);  
    },
    Equals: function(state) {
        return Equals(state, this.Get());
    },
    ToString: function () {
        return JSON.stringify(this.Get());
    }
}