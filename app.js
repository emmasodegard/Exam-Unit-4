import Game from './models/Game.mjs';

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