const backgroundSound = document.querySelector('.sound');
const volume = document.querySelector('.volume');
const mute = document.querySelector('.mute');
const audio = document.querySelector('audio');

const iconInfo = document.querySelector('.icon-info');
const gameInfo = document.querySelector('.game-info');
const close = document.querySelector('.close');

const flipSound = document.getElementById('flip');
const gameOverSound = document.getElementById('game-over');
const matchedSound = document.getElementById('match');
const victorySound = document.getElementById('victory');

const flipCount = document.getElementById('flips');
const victory = document.getElementById('victory-text');

let totalClick = 0;
let cardToCheck = null;
let matchedCards = [];

let busy;

backgroundSound.addEventListener('click', () => {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  } else {
    audio.volume = 0.2;
    audio.play();
  }
  volume.classList.toggle('active');
  mute.classList.toggle('active');
});

iconInfo.addEventListener('click', () => {
  // gameInfo.style.display = 'block';
  gameInfo.classList.toggle('visible');
});

close.addEventListener('click', () => {
  // gameInfo.style.display = 'none';
  gameInfo.classList.toggle('visible');
});

function flipCard(card, cards) {
  if (canFlipCard(card)) {
    card.classList.add('visible');
    totalClick++;
    flipCount.innerText = totalClick;
    flipSound.play();

    if (cardToCheck) {
      checkForCardMatch(card);
    } else {
      cardToCheck = card;
    }
  }

  if (matchedCards.length === cards.length) {
    victorySound.play();
    victory.classList.add('visible');
  }
}

function canFlipCard(card) {
  return !busy && !matchedCards.includes(card) && card !== cardToCheck;
}

function getCardValue(card) {
  return card.getElementsByClassName('card-value')[0].src;
}

function checkForCardMatch(card) {
  if (getCardValue(card) === getCardValue(cardToCheck)) {
    matchedSound.play();
    cardMatched(card, cardToCheck);
  } else {
    cardMismatch(card, cardToCheck);
  }

  cardToCheck = null;
}

function cardMatched(card1, card2) {
  matchedCards.push(card1);
  matchedCards.push(card2);
  card1.classList.add('matched');
  card2.classList.add('matched');
}

function cardMismatch(card1, card2) {
  busy = true;
  setTimeout(() => {
    card1.classList.remove('visible');
    card2.classList.remove('visible');
    busy = false;
  }, 1000);
}

function shuffleCards(cardsArray) {
  // Fisher-Yates Shuffle Algorithm
  for (let i = cardsArray.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    cardsArray[randomIndex].style.order = i;
    cardsArray[i].style.order = randomIndex;
  }
}

function timeRemaining(time) {
  const timeRemaining = document.getElementById('time-remaining');
  const gameOver = document.getElementById('game-over-text');
  const interval = setInterval(countdown, 1000);

  function countdown() {
    if (time === 0) {
      clearTimeout(interval);
      gameOverSound.play();
      gameOver.classList.add('visible');
      reset();
    } else {
      time--;
      timeRemaining.innerText = time;

      if (victory.classList.contains('visible')) {
        clearInterval(interval);
      }
    }
  }
}

function gameStart(time, cards) {
  timeRemaining(time);
  shuffleCards(cards);
  busy = false;
  reset();
}

function reset() {
  const overlays = Array.from(document.getElementsByClassName('overlay-text'));
  const cards = Array.from(document.getElementsByClassName('card'));

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', () => {
      victory.classList.remove('visible');
      totalClick = 0;
      flipCount.innerText = 0;
      matchedCards = [];

      cards.forEach((card) => {
        card.classList.remove('visible');
        card.classList.remove('matched');
      });
    });
  });
}

function ready() {
  const overlays = Array.from(document.getElementsByClassName('overlay-text'));
  const cards = Array.from(document.getElementsByClassName('card'));

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      flipCard(card, cards);
    });
  });

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      gameStart(101, cards);
    });
  });
}

ready();
