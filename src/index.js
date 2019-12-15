const electron = require('electron');
const { ipcRenderer } = electron;
const Coin = require(path.join(__dirname, 'coin.js'));

const MAX_SLOTS = 8;

let recommendations = ["Bitcoin", "Ethereum", "Ripple", "Bitcoin Cash", "EOS", "Litecoin", "Cardano", "Stellar"];
let coins = Coin.requestCoins();

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

function filterSearch(event) {
    console.log('Called');
    let searchArea = document.querySelector('#search-area');
    clearSuggestions(searchArea);
    let searchSuggestions = searchArea.querySelector('.search-suggestions')


    if (typeof filterSearch.previous == 'undefined' || typeof filterSearch.filtered == 'undefined') {
        filterSearch.previous = '';
        filterSearch.filtered = coins;

    } else if (filterSearch.filtered.length == 0) {
        filterSearch.filtered = coins;
    
    } else if (!event.target.value.startsWith(filterSearch.previous)) { // if previous changed redo filter
        filterSearch.filtered = coins.filter(coin => {
            return coin.name.toLowerCase().startsWith(event.target.value.toLowerCase())
        });

    } else {
        filterSearch.filtered = filterSearch.filtered.filter(coin => {
            return coin.name.toLowerCase().startsWith(event.target.value.toLowerCase());
        });
    }

    for (let i = 0; i < (filterSearch.length < MAX_SLOTS ? filterSearch.length : MAX_SLOTS); i++) {
        console.log(filterSearch.filtered[i]);
        let box = document.createElement('div');
        box.setAttribute('class', 'box column is-one-quarter');
        
        let coinLabel = document.createElement('strong');
        coinLabel.textContent = filterSearch.filtered[i].name;

        box.appendChild(coinLabel);
        searchSuggestions.appendChild(box);
    }

    filterSearch.previous = event.target.value;

}

function assembleSuggestions(searchArea) {
    let searchSuggestions = searchArea.querySelector('.search-suggestions')

    clearSuggestions(searchArea).then(function() {
        searchSuggestions = searchArea.querySelector('.search-suggestions') // since it got overwritten in clearSuggestions()
        // Add boxes
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

window.setTimeout(() => {
    coins = Coins.requestCoins();
    coins.sort((left, right) => {
        return right.price_usd - left.price_usd;
    });
}, 1000 * 60 * 2); // 2mins

window.onload = function() {
    let searchArea = document.querySelector('#search-area');
    let searchBar = searchArea.querySelector(".search-bar");
    searchBar.addEventListener('input', filterSearch);
    console.log('clicked!');
}
