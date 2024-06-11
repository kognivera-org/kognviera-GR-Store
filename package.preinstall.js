const fs = require('fs');

// creates fake 'fsevents' node module to fix VS errors
if (process.platform === 'win32') {

    let path = [
        './node_modules/',
        './node_modules/fsevents/',
        './node_modules/fsevents/package.json'
    ];

    if (!fs.existsSync(path[0])) {
        fs.mkdirSync(path[0]);
    }
    if (!fs.existsSync(path[1])) {
        fs.mkdirSync(path[1]);
    }
    fs.writeFileSync(path[2],'{"name":"fsevents","version":"1.0.0","os": ["!darwin"]}');
}