'use strict'

let sqew = [
    '.sqewOne',
    '.sqewTwo',
    '.sqewThree',
    '.sqewFour',
    '.sqewFive'
]

sqew.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener('click', function () {
        this.classList.toggle('unskewed');
      });
    }
  });
