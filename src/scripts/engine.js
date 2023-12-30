const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
  },

  values: {
    timerId: null,
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
  },
};

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomPosition = state.view.squares[Math.floor(Math.random() * 9)];
  randomPosition.classList.add("enemy");

  /*state.values.currentEnemy = randomPosition.id;*/
}

function moveEnemy() {
  state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {});
  /*if (square.id === state.values.currentEnemy) return;
        square.addEventListener('click', hitBox);
    });*/
}

function init() {
  moveEnemy();
}

init();
