
const { contextBridge } = require('electron');
const os = require('os');
const path = require('path'); // MME55847 (13Feb26)

contextBridge.exposeInMainWorld('systemInfo', {
    getPCName: () => os.hostname(),

    
  // MME55847 (13Feb26): New: build a correct file:// URL to resources folder in packaged app
  // MME55847 (13Feb26): Usage from renderer: window.systemInfo.getResourceUrl('images/QR2.png')
  getResourceUrl: (relativePath) => {
    let basePath;

    /*//DEV mode (npm start)
    if (process.defaultApp){
      // app root folder
      basePath = path.join(__dirname, '..');
    }
    // PROD mode (installed app)
    else {
      basePath = process.resourcesPath;
    }*/

    //MME55847 02Apr26
    // ✅ DEV mode (npm start / npx electron .)
    if (process.resourcesPath.includes('node_modules')) {
        // project root → images
        basePath = path.join(__dirname, '..');
    }
    // ✅ PROD mode (installed EXE)
    else {
        //basePath = path.join(process.resourcesPath, 'images');
        basePath = process.resourcesPath;
    }
    //MME55847 02Apr26 End

    const absPath = path.join(basePath, relativePath);
    return `file:///${absPath.replace(/\\/g, '/')}`;
  }

});



