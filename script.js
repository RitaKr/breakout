const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

function keyDown(e) {
  if (e.key == "ArrowRight" || e.key == "Right") {
    brick.dx = brick.speed;
  } else if (e.key == "ArrowLeft" || e.key == "Left") {
    brick.dx = -brick.speed;
  }
}
function keyUp(e) {
  if (
    e.key == "ArrowRight" ||
    e.key == "Right" ||
    e.key == "ArrowLeft" ||
    e.key == "Left"
  ) {
    brick.dx = 0;
  }
}
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
/*
ctx.fillRect(100, 100, 200, 100); //x, y, width, height (px)
ctx.fillStyle = "blue";
*/
let score = 0;
let level = 1;
let brickRowCount = 9;
let brickColumnCount = 5;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};
const brick = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

console.log(bricks);

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      //console.log(brick);
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0e70cc" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0e70cc";
  ctx.fill();
  ctx.closePath();
}
function drawBrick() {
  ctx.beginPath();
  ctx.rect(brick.x, brick.y, brick.w, brick.h);
  ctx.fillStyle = "#0e70cc";
  ctx.fill();
  ctx.closePath();
}
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score ${score}`, canvas.width - 100, 30);
}
function drawLevel() {
  ctx.font = "20px Arial";
  ctx.fillText(`Level ${level}`, 30, 30);
}
function moveBrick() {
  brick.x += brick.dx;
  if (brick.x + brick.w > canvas.width) {
    console.log(brick, canvas.width);
    brick.x = canvas.width - brick.w;
    console.log(brick);
  }
  if (brick.x < 0) {
    brick.x = 0;
  }
}
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (
    ball.y + ball.size > canvas.height ||
    ball.y - ball.size < 0 /*|| ball.y + ball.size > brick.y */
  ) {
    ball.dy *= -1;
  }
  if (
    ball.x - ball.size > brick.x /*- ball.size*/ &&
    ball.x + ball.size < brick.x + brick.w /*+ ball.size*/ &&
    ball.y + ball.size > brick.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) => {
    column.forEach((brick) => {
      //console.log(brick);
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          brick.visible = false;
          ball.dy *= -1;
          increaseScore();
        }
      }
    });
  });
  if (ball.y + ball.size > canvas.height) {
    score = 0;
    showAllBricks();
  }
}

function increaseScore() {
  score++;
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
  if (score !== 0) {
    ball.speed += 2;
    level++;
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBrick();
  drawScore();
  drawLevel();
  drawBricks();
}
function update() {
  moveBrick();
  moveBall();
  draw();
  requestAnimationFrame(update);
}
update();
