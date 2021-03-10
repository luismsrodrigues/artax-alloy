const { exec } = require('child_process');
const PLATFORM = process.platform;
const FS = require('fs');

const isRunning = (query) => {
    return new Promise((resolve, reject)=>{
        let cmd = '';
        switch (PLATFORM) {
            case 'win32' : cmd = `tasklist`; break;
            case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
            case 'linux' : cmd = `ps -A`; break;
            default: break;
        }
        exec(cmd, (err, stdout, stderr) => {
            resolve(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
        });
    });
}

const start = (program) => {
    return {
        WithDirectory: (directory) => {
            return new Promise((resolve, reject) => {
                exec(`start /d "${directory}" ${program}`, (err, stdout, stderr) => {
                    if(err || stderr){
                        reject(err);
                    }

                    resolve(stdout);
                });
            });
        },
        OpenProgram: () => {
            return new Promise((resolve, reject) => {
                exec(`start "" ${program}`, (err, stdout, stderr) => {
                    if(err || stderr){
                        reject(err);
                    }

                    resolve(stdout);
                });
            });
        }
    }
}

const stop = (program) => {
    return new Promise((resolve, reject) => {
        exec(`taskkill /F /IM ${program}`, (err, stdout, stderr) => {
            if(err || stderr){
                reject(err);
            }

            resolve(stdout);
        });
    });
}

const ExitAction = (code) => {
    return new Promise((resolve, reject) => {
        console.log(`Stop code ${code}.\nPress enter to exit.`);
        process.stdin.once('data', function () {
            resolve();
            process.exit(code);
        });
    });
};

const Utils = {
    Process: {
        isRunning,
        start,
        stop
    },
    Directory:{
        Exists: (path) => {
            return new Promise((resolve, reject) => {
                FS.stat(path, function(err) {
                    if (!err) {
                        resolve(true);
                    }
                    else if (err.code === 'ENOENT') {
                        resolve(false);
                    }
                });
            });
        }
    },
    Application: {
        OnBeforeExit: async () => null,
        Exit: async function(code) {
            await this.OnBeforeExit();
            await ExitAction(code);
        }
    }
}


module.exports = Utils;