const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
  },

  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    currentTime: 5,
  },

  Actions: {
    timerId: setInterval(randomSquare, 1000),
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime === 0) {
    clearInterval(state.Actions.countDownTimerId);
    clearInterval(state.Actions.timerId);
    Swal.fire({
      title: "TIMEOUT!",
      text: "Your final score is " + state.values.result,
      icon: "info",
      confirmButtonText: "Cool",
      timer: 2000,
      didOpen: () => {
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomPosition = state.view.squares[Math.floor(Math.random() * 9)];
  randomPosition.classList.add("enemy");
  state.values.hitPosition = randomPosition.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      }
    });
  });
}

function init() {
  addListenerHitBox();
}

init();
