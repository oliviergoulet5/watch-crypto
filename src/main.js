const electron = require('electron');
const url = require('url');
const path = require('path');
const coin = require('coin.js');

const { app, BrowserWindow, Menu, ipcMain } = electron; // destructuring

let mainWindow;
let addCryptoWindow;

tracked = []; // object of currencies
module.exports.addCurrency = function(coin) { tracked.push(coin) };
module.exports.removeCurrency = function(coin) { 
    let index = tracked.indexOf(coin.exchange_id);
    if (index > -1) {
        tracked.splice(index, 1);
    }
}

// Listen for the app to be ready
app.on('ready', () => {
    // Create new window
    mainWindow = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load HTML file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when close
    mainWindow.on('closed', () => { app.quit() });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Add Cryptocurrency Window
function createAddCrypto() {
    addCryptoWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Cryptocurrency',
        webPreferences: {
            nodeIntegration: true
        }
    })

    addCryptoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addCryptoWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage collection handling
    addCryptoWindow.on('close', () => { addWindow = null });
}

// Catch crypto-item:add
ipcMain.on('crypto-item:add', (event, cryptoItem) => {
    console.log(cryptoItem);
    mainWindow.webContents.send('crypto-item:add', cryptoItem);
    addCryptoWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Crypto',
                accelerator: 'CmdOrCtrl+E',
                click() {
                    createAddCrypto();
                }
            },
            {
                label: 'Remove Crypto',
                accelerator: 'CmdOrCtrl+T'
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// For macOS' menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add dev tools if not in production
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: 'CmdorCtrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}