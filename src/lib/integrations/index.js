module.exports = {
    ExecuteAction: async (action, ...args) => {
        if(action){
            await action(args);
        }
    }
}