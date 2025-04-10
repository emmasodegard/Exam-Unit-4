import Game from './models/Game.js';

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
    <p><strong>Year:</strong> ${game.year} &nbsp;&nbsp; <strong>Players:</strong> ${game.players} &nbsp;&nbsp; <strong>Time:</strong> ${game.time} &nbsp;&nbsp; <strong>Difficulty:</strong> ${game.difficulty}</p>
    <p><strong>Designer:</strong> ${game.designer}</p>
    <p><strong>Artist:</strong> ${game.artist}</p>
    <p><strong>Publisher:</strong> ${game.publisher}</p>
    <p><strong>BGG Listing:</strong> <a href="${game.url}" target="_blank">${game.url}</a></p>
    <p>Play Count: <input type="number" value="${game.playCount}" data-index="${index}" class="play-count"></p>
    <p>
      Rating: 
      <input type="range" min="0" max="10" value="${game.personalRating}" data-index="${index}" class="rating-slider">
      <span class="rating-value" id="rating-value-${index}">${game.personalRating}</span>
    </p>
<button data-index="${index}" class="delete-button">Delete</button>
<button data-index="${index}" class="edit-button">Edit</button>
  `;  

    gameList.appendChild(gameCard);
  });

  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const index = event.target.dataset.index;
      const gameToDelete = games[index];
      localStorage.removeItem(gameToDelete.title);
      games.splice(index, 1);
      renderGames();
    });
  });
  
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const index = event.target.dataset.index;
      const game = games[index];
      document.getElementById('new-title').value = game.title;
      document.getElementById('new-designer').value = game.designer;
      document.getElementById('new-artist').value = game.artist;
      document.getElementById('new-publisher').value = game.publisher;
      document.getElementById('new-year').value = game.year;
      document.getElementById('new-players').value = game.players;
      document.getElementById('new-time').value = game.time;
      document.getElementById('new-difficulty').value = game.difficulty;
      document.getElementById('new-url').value = game.url;
  
      games.splice(index, 1);
      localStorage.removeItem(game.title);
  
      renderGames();
    });
  });
  

  const ratingSliders = document.querySelectorAll('.rating-slider');

  ratingSliders.forEach(slider => {
    slider.addEventListener('input', function(event) {
      const index = event.target.dataset.index;
      const ratingValue = document.getElementById(`rating-value-${index}`);
      ratingValue.textContent = event.target.value;

      const max = event.target.max;
      const val = event.target.value;

      event.target.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${val * 10}%, #ccc ${val * 10}%, #ccc 100%)`;
    });

    const val = slider.value;
    slider.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${val * 10}%, #ccc ${val * 10}%, #ccc 100%)`;
  });

}

window.addEventListener('DOMContentLoaded', () => {
  const savedGames = getAllGames();
  savedGames.forEach(game => games.push(game));
  renderGames();

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

  const addGameButton = document.getElementById('add-game-button');
  addGameButton.addEventListener('click', function() {
    const title = document.getElementById('new-title').value.trim();
    const designer = document.getElementById('new-designer').value.trim();
    const artist = document.getElementById('new-artist').value.trim();
    const publisher = document.getElementById('new-publisher').value.trim();
    const year = parseInt(document.getElementById('new-year').value);
    const players = document.getElementById('new-players').value.trim();
    const time = document.getElementById('new-time').value.trim();
    const difficulty = document.getElementById('new-difficulty').value.trim();
    const url = document.getElementById('new-url').value.trim();

    if (!title) {
      alert('Please enter a title!');
      return;
    }

    const newGame = new Game(title, designer, artist, publisher, year, players, time, difficulty, url);

    games.push(newGame);
    saveGame(newGame);
    renderGames();

    document.getElementById('new-title').value = '';
    document.getElementById('new-designer').value = '';
    document.getElementById('new-artist').value = '';
    document.getElementById('new-publisher').value = '';
    document.getElementById('new-year').value = '';
    document.getElementById('new-players').value = '';
    document.getElementById('new-time').value = '';
    document.getElementById('new-difficulty').value = '';
    document.getElementById('new-url').value = '';
  });
});

document.addEventListener('input', function(event) {
  if (event.target.classList.contains('play-count')) {
    const index = event.target.dataset.index;
    games[index].playCount = parseInt(event.target.value);
    saveGame(games[index]);
  }

  if (event.target.classList.contains('rating-slider')) {
    const index = event.target.dataset.index;
    games[index].personalRating = parseInt(event.target.value);
    saveGame(games[index]);
  }
});

const sortOptions = document.getElementById('sort-options');
  
  let ascendingOrder = true;

  sortOptions.addEventListener('change', function() {
    sortGames();
  });
  
  const swapOrderButton = document.getElementById('swap-order-button');
  swapOrderButton.addEventListener('click', function() {
    ascendingOrder = !ascendingOrder; // Flip order
    sortGames();
  });
  
  function sortGames() {
    const selected = sortOptions.value;
  
    if (selected === 'players') {
      games.sort((a, b) => {
        const aFirstPlayer = parseInt(a.players.split('–')[0]);
        const bFirstPlayer = parseInt(b.players.split('–')[0]);
        return ascendingOrder ? aFirstPlayer - bFirstPlayer : bFirstPlayer - aFirstPlayer;
      });
    } else if (selected === 'rating') {
      games.sort((a, b) => ascendingOrder ? a.personalRating - b.personalRating : b.personalRating - a.personalRating);
    } else if (selected === 'difficulty') {
      const difficultyOrder = { 
        'Light': 1, 
        'Medium': 2, 
        'Medium-Heavy': 3, 
        'Hard': 4 
      };
      games.sort((a, b) => {
        return ascendingOrder 
          ? (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99)
          : (difficultyOrder[b.difficulty] || 99) - (difficultyOrder[a.difficulty] || 99);
      });
    } else if (selected === 'playCount') {
      games.sort((a, b) => ascendingOrder ? a.playCount - b.playCount : b.playCount - a.playCount);
    }
  
    renderGames(); 
  }