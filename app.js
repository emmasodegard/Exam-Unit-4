import Game from './models/Game.mjs';

const games = [];

function saveGame(game) {
  localStorage.setItem(game.title, JSON.stringify(game));
}

function getAllGames() {
  const games = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const gameData = JSON.parse(localStorage.getItem(key));
    games.push(gameData);
  }
  return games;
}

function exportGames() {
  const games = getAllGames();
  return JSON.stringify(games, null, 2);
}

function importGames(json) {
  const games = JSON.parse(json);
  games.forEach(game => {
    saveGame(game);
  });
}

function renderGames() {
  const gameList = document.getElementById('game-list');
  gameList.innerHTML = '';

  games.forEach((game, index) => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    gameCard.innerHTML = `
      <h2>${game.title}</h2>
      <p>Play Count: <input type="number" value="${game.playCount}" data-index="${index}" class="play-count"></p>
      <p>Rating: <input type="range" min="0" max="10" value="${game.personalRating}" data-index="${index}" class="rating-slider"></p>
      <button data-index="${index}" class="action-button">Action</button>
    `;

    gameList.appendChild(gameCard);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const savedGames = getAllGames();
  savedGames.forEach(game => games.push(game));
  renderGames();
});

const importInput = document.getElementById('importSource');

importInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;
    importGames(content);
    const importedGames = JSON.parse(content);
    importedGames.forEach(game => games.push(game));
    renderGames();
  };

  reader.onerror = function() {
    console.error('Error reading file');
  };

  reader.readAsText(file);
});