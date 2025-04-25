const initialTime = 1000; // Tempo inicial em milissegundos
let currentTime = initialTime; // Tempo atual que será reduzido
const difficultyIncrease = 50; // Quanto reduzir do tempo a cada nível
const minTime = 400; // Tempo mínimo (máxima dificuldade)
let difficultyLevel = 1; // Nível de dificuldade atual
let difficultyTimer = null; // Timer para controlar a dificuldade

const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    difficultyDisplay: null, // Novo elemento para mostrar o nível
  },

  values: {
    gameVelocity: currentTime,
    hitPosition: 0,
    result: 0,
    resultRegister: [],
    currentTime: 60,
    lives: 3,
    difficultyLevel: 1, // Nível de dificuldade inicial
  },

  Actions: {
    timerId: null, // Timer para o jogo
    countDownTimerId: null, // Timer para contagem regressiva
    difficultyTimer: null, // Timer para aumentar a dificuldade
  },
};

function increaseDifficulty() {
  difficultyLevel++;
  state.values.difficultyLevel = difficultyLevel;

  // Atualiza o display de nível
  state.view.difficultyDisplay.querySelector("span").textContent =
    difficultyLevel;

  // Reduz o tempo de troca do personagem
  currentTime = Math.max(
    minTime,
    initialTime - (difficultyLevel - 1) * difficultyIncrease
  );
  state.values.gameVelocity = currentTime;

  // Reinicia o timer do jogo com a nova velocidade
  clearInterval(state.Actions.timerId);
  state.Actions.timerId = setInterval(randomSquare, currentTime);

  // Efeito visual para mostrar a mudança de nível
  state.view.difficultyDisplay.style.color = "#ff0000";
  setTimeout(() => {
    state.view.difficultyDisplay.style.color = "#fff";
  }, 500);

  // Reproduzir som de aumento de nível
  playSound("level-up");
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function resetGame() {
  clearInterval(state.Actions.timerId);
  clearInterval(state.Actions.countDownTimerId);
  clearInterval(state.Actions.difficultyTimer);

  // Reinicialize o estado
  state.values.hitPosition = 0;
  state.values.result = 0;
  state.values.currentTime = 60;

  // Reseta a dificuldade
  difficultyLevel = 1;
  state.values.difficultyLevel = 1;
  currentTime = initialTime;
  state.values.gameVelocity = currentTime;
  state.view.difficultyDisplay.querySelector("span").textContent =
    difficultyLevel;

  // Atualize as visualizações
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.score.textContent = state.values.result;
  state.view.lives.textContent = state.values.lives;

  // Reinicie os timers
  state.Actions.timerId = setInterval(randomSquare, currentTime);
  state.Actions.countDownTimerId = setInterval(countDown, 1000);
  state.Actions.difficultyTimer = setInterval(increaseDifficulty, 10000); // A cada 10 segundos
}

function livesCounter() {
  state.values.lives--;
  state.view.lives.textContent = state.values.lives;
  state.values.resultRegister.push(state.values.result);

  if (state.values.lives > 0) {
    resetGame();
  } else {
    clearInterval(state.Actions.difficultyTimer); // Limpa o timer de dificuldade

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
    clearInterval(state.Actions.difficultyTimer); // Limpa o timer de dificuldade

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

function init() {
  // Cria o indicador de nível
  state.view.difficultyDisplay = document.createElement("div");
  state.view.difficultyDisplay.classList.add("difficulty-display");
  state.view.difficultyDisplay.innerHTML = `Level: <span>${difficultyLevel}</span>`;
  state.view.difficultyDisplay.style.position = "absolute";
  state.view.difficultyDisplay.style.top = "90px";
  state.view.difficultyDisplay.style.right = "20px";
  state.view.difficultyDisplay.style.fontSize = "20px";
  state.view.difficultyDisplay.style.color = "#fff";
  state.view.difficultyDisplay.style.fontFamily = "Press Start 2P";
  document.body.appendChild(state.view.difficultyDisplay);

  // Inicia os timers
  state.Actions.timerId = setInterval(randomSquare, currentTime);
  state.Actions.countDownTimerId = setInterval(countDown, 1000);
  state.Actions.difficultyTimer = setInterval(increaseDifficulty, 10000); // A cada 10 segundos

  addListenerHitBox();
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

init();
