/**
 * Лисин Сергей lisin2@yandex.ru
 */

"use strict";

class Tag {

  constructor () {
    this.defaultValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
    this.cards = [];
    this.steps = 0;
  }

  getRandomizedValues () {
    let randomValues = [...this.defaultValues];
    let x = 0;
    let y = 0;

    this.cards = randomValues
      .sort(() => Math.random() - 0.5)
      .map((value) => {
        if (x === 4) {
          x = 0;
          y++;
        }

        return {
          value: value,
          x: x++,
          y: y
        }
      });
  };

  drawGameField () {

    let gameField = document.getElementById('game');
    const sizeField = 200;

    gameField.innerHTML = '';

    this.cards.forEach((item, i) => {
      let g = `
        <g data-id="${i}" class="card-group">
            <rect 
              class="${(item.value) ? 'card-square' : 'card-square-empty'}" 
              x="${item.x * sizeField}" 
              y="${item.y * sizeField}" 
              width="${sizeField}" 
              height="${sizeField}">
            </rect>
            <text 
              class="card-text" 
              text-anchor="middle" 
              x="${item.x * sizeField + sizeField / 2 + 10 }" 
              y="${item.y * sizeField + sizeField / 2 + 10}">
                ${(item.value) ? item.value : ''}
            </text>
        </g>
      `;
      gameField.innerHTML += g;
    });

    let cardElements = document.getElementsByClassName('card-group');

    for (let i = 0; i < cardElements.length; i++) {
      cardElements[i].onclick = (e) => this.changeCard(e.currentTarget.dataset.id);
    }
  };

  changeCard (id) {
    let card = this.cards[id];

    if (card.value === null) {
      this.playSound('error');
      return
    }

    let emptyCard = this.cards.filter((card) => card.value === null)[0];

    if ((Math.abs(card.x - emptyCard.x) + Math.abs(card.y - emptyCard.y)) === 1) {
      emptyCard.value = card.value;
      card.value = null;
      this.steps++;
      this.playSound('change');
      this.drawGameField();
      this.checkWin();
    } else {
      this.playSound('error');
    }
  };

  playSound (name) {
    let audio = new Audio();
    audio.src = `media/${name}.mp3`;
    audio.autoplay = true;
  };

  checkWin () {
    let resultValues = this.cards.map((card) => card.value);

    if (JSON.stringify(this.defaultValues) === JSON.stringify(resultValues)) {
      this.playSound('win');

      if (confirm(`Поздравляем, вы выиграли за ${this.steps} шагов. Начать заново?`)) {
        this.run();
      }
    }
  };

  run () {
    this.steps = 0;
    this.getRandomizedValues(this.defaultValues);
    this.drawGameField();
  };
}

new Tag().run();


