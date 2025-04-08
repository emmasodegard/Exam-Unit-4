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

window.addEventListener('DOMContentLoaded', () => {
  const savedGames = getAllGames();
  savedGames.forEach(game => games.push(game));
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
  };

  reader.onerror = function() {
    console.error('Error reading file');
  };

  reader.readAsText(file);
});