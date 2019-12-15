const electron = require('electron');
const url = require('url');
const path = require('path');

const Coin = require(path.join(__dirname, 'coin.js'));

const { app, BrowserWindow, Menu, webContents, ipcMain } = electron; // destructuring

let mainWindow;

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
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // DOM
    contents = mainWindow.webContents;

    // Quit app when close
    mainWindow.on('closed', () => { app.quit() });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
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
                    mainWindow.webContents.send('show-add-crypto')
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
