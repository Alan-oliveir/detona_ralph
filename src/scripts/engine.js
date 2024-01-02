const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
  },

  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    resultRegister: [],
    currentTime: 60,
    lives: 3,
  },

  Actions: {
    timerId: setInterval(randomSquare, 1000),
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function resetGame() {
  clearInterval(state.Actions.timerId);
  clearInterval(state.Actions.countDownTimerId);

  // Reinicialize o estado
  state.values.hitPosition = 0;
  state.values.result = 0;
  state.values.currentTime = 60;

  // Atualize as visualizações
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.score.textContent = state.values.result;
  state.view.lives.textContent = state.values.lives;

  // Reinicie os timers
  state.Actions.timerId = setInterval(randomSquare, 1000);
  state.Actions.countDownTimerId = setInterval(countDown, 1000);
}

function livesCounter() {
  state.values.lives--;
  state.view.lives.textContent = state.values.lives;
  state.values.resultRegister.push(state.values.result);

  if (state.values.lives > 0) {
    resetGame();
  } else {
    Swal.fire({
      title: "GAME OVER!",
      text:
        "Your best score is " +
        Math.max.apply(null, state.values.resultRegister),
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "RESTART",
      denyButtonText: "EXIT",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      } else if (result.isDenied) {
        window.close();
      }
    });

    playSound("beep");
  }
}

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
      showConfirmButton: false,
      timer: 1200,
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

    playSound("failure");
    livesCounter();
  }
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
