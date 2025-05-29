'use strict'

let sqew = [
    '.sqewOne',
    '.sqewTwo',
    '.sqewThree',
    '.sqewFour',
    '.sqewFive'
]

const monitor = document.querySelector('.monitor');

function updateMonitorVisibility() {
    const anyUnskewed = sqew.some(selector => {
        const el = document.querySelector(selector);
        return el && el.classList.contains('unskewed');
    });

    const isSmallScreen = window.matchMedia('(max-width: 1000px)').matches;

    if (monitor) {
        monitor.style.display = (anyUnskewed || isSmallScreen) ? 'none' : 'block';
    }
}

// Навешиваем обработчики клика
sqew.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener('click', function () {
            this.classList.toggle('unskewed');
            updateMonitorVisibility();
        });
    }
});


window.addEventListener('resize', updateMonitorVisibility);

updateMonitorVisibility();

