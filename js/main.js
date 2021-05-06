const cards = document.querySelectorAll('.memory-card');
const player = document.querySelector('lottie-player');
const btnSubmit = document.querySelector('#play');
const form = document.querySelector('form');
const textError = document.querySelector('.text-error');
const memoryGame = document.querySelector('.memory-game');
const input = document.querySelector('#inputNumber')

let memoryCards;
let hasFlippedCard = false;
let lockBoard = true;
let numCheckMatch = 0;
let numItems = 0;
let maxCheckMatch = cards.length / 2;
let firstCard, secondCard;
let arrayNumberParts = [];
let arrayRandomNum = [];

function createParts(img, dataItem) {
  const memoryCard = document.createElement('div');
  const frontFace = document.createElement('div');
  const backFace = document.createElement('div');
  const imgPart = document.createElement('img');

  imgPart.setAttribute('src', img );

  memoryCard.classList.add('memory-card');
  frontFace.classList.add('front-face');
  backFace.classList.add('back-face');

  memoryCard.style.width = 50 - ((arrayNumberParts.length / 2) + 16) + 'vh';
  memoryCard.style.maxWidth = 50 - ((arrayNumberParts.length / 2) + 15) + 'vmin';
  memoryCard.style.height = 50 - ((arrayNumberParts.length / 2) + 16) + 'vh';
  memoryCard.style.maxHeight = 50 - ((arrayNumberParts.length / 2) + 15) + 'vmin';

  memoryCard.setAttribute('data-item', dataItem);

  frontFace.appendChild(imgPart);
  memoryCard.appendChild(frontFace);
  memoryCard.appendChild(backFace);

  document.querySelector('.memory-game').appendChild(memoryCard)
}

function generateUniqueRandom(maxNum) {
  //Generate random number
  let random = (Math.random() * maxNum).toFixed();

  //Coerce to number by boxing
  random = Number(random);

  if(!arrayRandomNum.includes(random)) {
      arrayRandomNum.push(random);
      return random;
  } else {
      if(arrayRandomNum.length < maxNum) {
        //Recursively generate number
      return  generateUniqueRandom(maxNum);
      } else {
        console.log('No more numbers available.')
        return  generateUniqueRandom(maxNum);
      }
  }
}


function generateParts() {
  arrayNumberParts.forEach(function(item, index) {
    var randomNum = Math.floor(Math.random() * 50);

    randomNum = generateUniqueRandom(50);
    
    if (index % 2 !== 0) {
      createParts('https://picsum.photos/id/'+ randomNum +'/200/200', randomNum)
      createParts('https://picsum.photos/id/'+ randomNum +'/200/200', randomNum)
    }
  })

  memoryCards = document.querySelectorAll('.memory-card')

  let intervalParts = setInterval(() => {
    if (numItems === memoryCards.length - 1) {
      clearInterval(intervalParts)
      lockBoard = false;
    }
  
    memoryCards[numItems].classList.add('active')
    numItems++;
    
  }, 100);

  memoryCards.forEach(function (card) {
    let randomPos = Math.floor(Math.random() * arrayNumberParts.length);
    card.style.order = randomPos;
    card.onclick = function() {
      flipCard(card)
    }
  });
}

function flipCard (cardItem) {
  if (lockBoard) return;
  if (cardItem === firstCard) return;

  cardItem.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = cardItem;

    return
  }

  secondCard = cardItem;
  hasFlippedCard = false;

  checkForMatch()
}

function checkForMatch() {
  if (firstCard.dataset.item === secondCard.dataset.item) {
    numCheckMatch++;

    if (numCheckMatch === (memoryCards.length / 2)) {
      gameCompletedAnimation();
      playSound('winner');
    } else {

      playSound('yeay');
    }


    disableCards();
    return;
  }

  unflipCards();
}

function playSound(sound) {
  var audio = new Audio('/assets/audio/' + sound + '.mp3');

  setTimeout(() => {
    audio.play()
  }, 500);
}

function disableCards() {
  firstCard.onclick = function() {}
  secondCard.onclick = function() {}

  resetBoard()
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard()
  }, 1500);

  playSound('error')
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;

  firstCard = null;
  secondCard = null;
}  

function resetGame() {
  memoryCards.forEach(function(item) {
    item.classList.remove('active');
    item.classList.add('invert');
    arrayNumberParts = [];
    numItems = 0;
    numCheckMatch = 0;
    
    setTimeout(() => {
      item.classList.add('hide');
    }, 1000)

    setTimeout(() => {
      item.remove()
      form.style.display = 'block';
    }, 1500)

    setTimeout(() => {
      memoryGame.style.display = 'none';

      form.classList.remove('hide');
    }, 2000);
  })
}

function gameCompletedAnimation() {
  playSound('winner')

  setTimeout(() => {
    player.play();
    player.setDirection(1);
  }, 1000);

  setTimeout(() => {
    player.play();
    player.setDirection(-1);
  }, 4500);
  
  setTimeout(() => {
    resetGame()
  }, 6500);
}

function playGame() {
  const numParts = parseInt(input.value)

  for (let i = 0; i < numParts; i++) {
    arrayNumberParts.push(i)
  }

  if (!arrayNumberParts.length) return;

  if (numParts % 2 !== 0) {
    textError.textContent = 'Por favor, insira um número par de peças';
    return
  } else if (numParts > 40) {
    textError.textContent = 'Máximo de 40 peças';
    return
  }

  form.classList.add('hide');
  
  setTimeout(() => {
    form.style.display = 'none';
    memoryGame.style.display = 'flex';
    input.value = '';
    textError.textContent = '';
  }, 400);

  setTimeout(() => {
    generateParts()
  }, 600)
}

btnSubmit.onclick = playGame;