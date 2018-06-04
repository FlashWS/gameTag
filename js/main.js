/**
 * Лисин Сергей lisin2@yandex.ru
 */

"use strict";

class Tag {

  constructor () {
    this.defaultValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
    this.cards = [];
    this.steps = 0;
    this.gameField = document.getElementById('game');
  }

  run () {
    this.steps = 0;
    this._getRandomizedValues(this.defaultValues);
    this._drawGameField();
    this._addEvent();
  }

  _getRandomizedValues () {
    let randomValues = [...this.defaultValues];
    let x = 0;
    let y = 0;

    this.cards = randomValues
      .sort(() => Math.random() - 0.5)
      .map(value => {
        if (x === 4) {
          x = 0;
          y++;
        }

        return {
          value: value,
          x: x++,
          y: y
        };
      });
  }

  _drawGameField () {
    const sizeField = 150;
    let cardsHTML = '';

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
              x="${item.x * sizeField + sizeField / 2}" 
              y="${item.y * sizeField + sizeField / 2 + 10}">
                ${(item.value) ? item.value : ''}
            </text>
        </g>
      `;
      cardsHTML += g;
    });

    this.gameField.innerHTML = cardsHTML;
  }

  _addEvent () {
    this.gameField.addEventListener('click', (e) => {
      let target = e.target;

      while (target != 'svg') {
        if (target.tagName == 'g') {
          this._clickCard(target.dataset.id);
          return;
        }
        target = target.parentNode;
      }
    });
  }

  _clickCard (id) {
    let card = this.cards[id];

    if (card.value === null) {
      this._playSound('error');
      return;
    }

    let emptyCard = this.cards.find(card => card.value === null);

    if ((Math.abs(card.x - emptyCard.x) + Math.abs(card.y - emptyCard.y)) === 1) {
      emptyCard.value = card.value;
      card.value = null;
      this.steps++;
      this._playSound('change');
      this._drawGameField();
      this._checkWin();
    } else {
      this._playSound('error');
    }
  }

  _playSound (name) {
    return new Promise((resolve) => {
      let audio = new Audio();
      audio.src = `media/${name}.mp3`;
      audio.autoplay = true;
      audio.onplaying = resolve;
    })
  }

  _checkWin () {
    let resultValues = this.cards.map(card => card.value);

    if (this.defaultValues.toString() === resultValues.toString()) {
      let play = this._playSound('win');

      play.then(() => {
        if (confirm(`Поздравляем, вы выиграли за ${this.steps} шагов. Начать заново?`)) {
          this.run();
        }
      });
    }
  }

}

new Tag().run();