document.addEventListener("DOMContentLoaded", () => {
  const PLAYGROUND = document.getElementById("playground");
  const MINISCREEN = document.querySelector(".mini-screen");
  const PGDIVCOUNT = 200;
  const MSDIVCOUNT = 16;
  const WIDTH = 10;
  const SCOREDISPLAY = document.querySelector("#score");
  const STARTBTN = document.querySelector("#start");
  let count = 0;
  let nextRandom = 0;
  let timerId = null;
  let score = 0;
  const COLORS = ["orange", "red", "purple", "green", "blue"];

  while (count < PGDIVCOUNT) {
    PLAYGROUND.innerHTML += `<div></div>`;
    count++;
  }
  count = 0;
  while (count < MSDIVCOUNT) {
    MINISCREEN.innerHTML += `<div></div>`;
    count++;
  }
  for (let i = 0; i < 10; i++) {
    PLAYGROUND.innerHTML += `<div class="taken"></div>`;
  }
  let squares = Array.from(document.querySelectorAll("#playground div"));

  //   The Tetrominoes
  const L_TETROMINO = [
    [1, WIDTH + 1, WIDTH * 2 + 1, 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [WIDTH * 2, WIDTH * 2 + 1, WIDTH + 1, 1],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2],
  ];
  const Z_TETROMINO = [
    [WIDTH * 2, WIDTH * 2 + 1, WIDTH + 1, WIDTH + 2],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
    [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1],
  ];
  const T_TETROMINO = [
    [1, WIDTH, WIDTH + 1, WIDTH + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH + 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [WIDTH, 1, WIDTH + 1, WIDTH * 2 + 1],
  ];
  const O_TETROMINO = [
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
  ];
  const I_TETROMINO = [
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
  ];

  const TETROMINOES = [
    L_TETROMINO,
    Z_TETROMINO,
    T_TETROMINO,
    O_TETROMINO,
    I_TETROMINO,
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * TETROMINOES.length);
  let current = TETROMINOES[random][currentRotation];

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = COLORS[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  function moveDown() {
    undraw();
    currentPosition += WIDTH;
    draw();
    freeze();
  }

  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + WIDTH].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * TETROMINOES.length);
      current = TETROMINOES[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % WIDTH === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % WIDTH === WIDTH - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = TETROMINOES[random][currentRotation];
    draw();
  }

  const DISPLAYSQUARES = document.querySelectorAll(".mini-screen div");
  const DISPLAYWIDTH = 4;
  let displayIndex = 0;

  const UPNEXTTETROMINOES = [
    [1, DISPLAYWIDTH + 1, DISPLAYWIDTH * 2 + 1, 2],
    [
      DISPLAYWIDTH * 2,
      DISPLAYWIDTH * 2 + 1,
      DISPLAYWIDTH + 1,
      DISPLAYWIDTH + 2,
    ],
    [1, DISPLAYWIDTH, DISPLAYWIDTH + 1, DISPLAYWIDTH + 2],
    [0, 1, DISPLAYWIDTH, DISPLAYWIDTH + 1],
    [1, DISPLAYWIDTH + 1, DISPLAYWIDTH * 2 + 1, DISPLAYWIDTH * 3 + 1],
  ];

  function displayShape() {
    DISPLAYSQUARES.forEach((square) => {
      square.classList.remove("tetromino"), (square.style.backgroundColor = "");
    });
    UPNEXTTETROMINOES[nextRandom].forEach((index) => {
      DISPLAYSQUARES[displayIndex + index].classList.add("tetromino"),
        (DISPLAYSQUARES[displayIndex + index].style.backgroundColor =
          COLORS[nextRandom]);
    });
  }

  STARTBTN.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * TETROMINOES.length);
      displayShape();
    }
  });

  function addScore() {
    for (let i = 0; i < 199; i += WIDTH) {
      const ROW = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (ROW.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        SCOREDISPLAY.innerHTML = score;
        ROW.forEach((index) => {
          squares[index].classList.remove("taken"),
            squares[index].classList.remove("tetromino"),
            (squares[index].style.backgroundColor = "");
        });
        const SQUARESREMOVED = squares.splice(i, WIDTH);
        squares = SQUARESREMOVED.concat(squares);
        squares.forEach((cell) => PLAYGROUND.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      SCOREDISPLAY.innerHTML = "END";
      clearInterval(timerId);
    }
  }
});
