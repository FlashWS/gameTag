"use strict";

function Tag () {

  let defaultValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
  let cards = [];
  let steps = 0;

  let spoilGame = (defaultValues) => {
    let values = [...defaultValues];
    let cards = [];
    let x = 0;
    let y = 0;

    values.sort(() => Math.random() - 0.5);

    values.forEach(function (item) {
      cards.push({
        value: item,
        x: x,
        y: y
      });

      x++;

      if (x === 4) {
        x = 0;
        y++;
      }
    });

    return cards;
  };

  let drawGameField = (cards) => {

    let gameField = document.getElementById('game');
    gameField.innerHTML = '';

    cards.forEach(function (item, i) {

      let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-id', i);
      g.setAttribute('class', 'card-group');

      let cardSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      cardSquare.setAttribute('class', 'card-square');
      cardSquare.setAttribute('x', item.x * 200);
      cardSquare.setAttribute('y', item.y * 200);
      cardSquare.setAttribute('width', 200);
      cardSquare.setAttribute('height', 200);
      g.appendChild(cardSquare);

      let cardValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      cardValue.setAttribute('class', 'card-text');
      cardValue.setAttribute('text-anchor', 'middle');
      cardValue.setAttribute('x', item.x * 200 + 100);
      cardValue.setAttribute('y', item.y * 200 + 110);
      cardValue.textContent = item.value;
      g.appendChild(cardValue);

      gameField.appendChild(g);

    });
    eventClick();
  };

  let eventClick = () => {
    let cardElements = document.getElementsByClassName('card-group');

    for (let i = 0; i < cardElements.length; i++) {
      cardElements[i].onclick = (e) => changeCard(e.currentTarget.dataset.id);
    }
  };

  let changeCard = (id) => {
    let card = cards[id];

    if (card.value === null) {
      soundPlay('error');
      return
    }

    let emptyCard = cards.filter((card) => card.value === null)[0];

    if ((Math.abs(card.x - emptyCard.x) + Math.abs(card.y - emptyCard.y)) === 1) {
      emptyCard.value = card.value;
      card.value = null;
      drawGameField(cards);
      steps++;
      soundPlay('change');
      checkWin();
    } else {
      soundPlay('error');
    }
  };

  let soundPlay = (name) => {
    let audio = new Audio();
    audio.src = `media/${name}.mp3`;
    audio.autoplay = true;
  };

  let checkWin = () => {
    let resultValues = cards.map((card) => card.value);

    if (JSON.stringify(defaultValues) === JSON.stringify(resultValues)) {
      soundPlay('win');

      if(confirm(`Поздравляем, вы выйграли за ${steps} шагов. Начать заново?`)){
        run();
      }
    }
  };

  let run = () => {
    steps = 0;
    cards = spoilGame(defaultValues);
    drawGameField(cards);
  };

  this.run = () => run()
}

let tag = new Tag();
tag.run();


