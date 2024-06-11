const fs = require('fs')
const ncp = require('ncp').ncp;
const Path = require('path')

const fo = {

    rmdirSync(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    fo.rmdirSync(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },

    cpdirSync(srcPath, destPath, callback) {
        const exists = fs.existsSync(destPath);
        if (exists) {
            fo.rmdirSync(destPath);
            console.log('fo-webpack:', destPath, 'directory removed.');
        }
        ncp(srcPath, destPath, function (err) {
            if (err) {
                return console.error('ncp', err);
            }
            const settings = fo.getSettings();
            fs.chmodSync(destPath, settings && settings.directoryPermissions);
            fo.renameAllFilesSync(destPath, '.scss');
            console.log('fo-webpack:', destPath, 'directory created.');
            callback();
        });

    },

    renameAllFilesSync(dir, extension) {
        const files = fs.readdirSync(dir);
        const match = '.css';
        const replace = extension;
        files.forEach(file => {
            const filePath = Path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) { // recurse
                fo.renameAllFilesSync(filePath, extension);
            } else { // rename file
                const newFilePath = Path.join(dir, file.replace(match, replace));
                //console.log(newFilePath);
                fs.renameSync(filePath, newFilePath);
                const settings = fo.getSettings();
                fs.chmodSync(newFilePath, settings && settings.filePermissions);
            }
        });
    },

    getSettings(env) {
        const environment = env || 'production';
        let settingsObject = {}
        let exportToClient = {}
        try {
            settingsObject = require('../settings.js')[environment]
            return settingsObject;
        } catch (err) {
            logger.error('==>     ERROR: Error parsing your settings.js.')
            logger.error(err)
        }
    }
}
export default fo;