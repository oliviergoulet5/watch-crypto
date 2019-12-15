const electron = require('electron');
const { ipcRenderer } = electron;

let recommendations = ["Bitcoin", "Bitcoin Cash", "Ethereum", "Litecoin", "Dash", "NEO"];

function clearSearch(searchArea) {
    let searchMain = searchArea.querySelector('.search-main');
    let searchBar = searchMain.querySelector('.search-bar');
    searchBar.value = '';
}

function clearSuggestions(searchArea) {
    let searchSuggestions = searchArea.querySelector('.search-suggestions')

    return new Promise((resolve, reject) => {
        let copySearchSuggestions = searchSuggestions.cloneNode(false);
        searchSuggestions.parentNode.replaceChild(copySearchSuggestions, searchSuggestions);
        resolve();
    })
}

function assembleSuggestions(searchArea) {
    let searchSuggestions = searchArea.querySelector('.search-suggestions')

    clearSuggestions(searchArea).then(function() {
        searchSuggestions = searchArea.querySelector('.search-suggestions') // since it got overwritten in clearSuggestions()
        // Add boxes
        console.log(searchSuggestions);
        for (let coin of recommendations) {
            let box = document.createElement('div');
            box.setAttribute('class', 'box column is-one-quarter');
            
            let coinLabel = document.createElement('strong');
            coinLabel.textContent = coin;

            box.appendChild(coinLabel);
            searchSuggestions.appendChild(box);
        }
    });

}

ipcRenderer.on('show-add-crypto', event => {
    let modal = document.querySelector('#add-crypto-modal');
    let searchArea = document.querySelector('#search-area');
    if (!modal.classList.contains('is-active')) {
        clearSearch(searchArea);
        assembleSuggestions(searchArea);
        modal.classList.add('is-active');
    }
});