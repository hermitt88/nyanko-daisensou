const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ne1Btn = document.querySelector("#ne1");
const ne2Btn = document.querySelector("#ne2");
const ne3Btn = document.querySelector("#ne3");
const resetBtn = document.querySelector("#resetGame");

const FRAMES = 1000 / 30;
let resizeTimer;

let gameTimer;
let stage1Timer;

const mapW = 3600;
const mapH = 900;
scale = document.body.clientWidth / mapW;
canvas.width = document.body.clientWidth;
canvas.height = canvas.width * 0.25;
ctx.scale(scale, scale);

var nekoMap, neId, wankoMap, wanId;
var currentMoney;
var moneyPerFrame;
var maxMoney;
var moneyLevel;

class Neko {
  constructor(
    cost,
    cooldown,
    width,
    height,
    speed,
    color,
    hp,
    atk,
    atkType,
    atkRange,
    atkSpeed1,
    atkSpeed2,
    atkSpeed3
  ) {
    this.cost = cost;
    this.cooldown = cooldown;
    this.id = neId;
    this.width = width;
    this.height = height;
    this.x = mapW - 100 - width;
    this.y = mapH - height;
    this.dx = -speed;
    this.color = color;
    this.hp = hp;
    this.atk = atk;
    this.atkType = atkType;
    this.lockon = false;
    this.atkState = -1;
    this.atkRange = atkRange;
    this.atkSpeed1 = atkSpeed1;
    this.atkSpeed2 = atkSpeed2;
    this.atkSpeed3 = atkSpeed3;
  }
}

class Wanko {
  constructor(
    reward,
    width,
    height,
    speed,
    color,
    hp,
    atk,
    atkType,
    atkRange,
    atkSpeed1,
    atkSpeed2,
    atkSpeed3
  ) {
    this.reward = reward;
    this.id = wanId;
    this.width = width;
    this.height = height;
    this.x = 100 + width;
    this.y = mapH - height;
    this.dx = speed;
    this.color = color;
    this.hp = hp;
    this.atk = atk;
    this.atkType = atkType;
    this.lockon = false;
    this.atkState = -1;
    this.atkRange = atkRange;
    this.atkSpeed1 = atkSpeed1;
    this.atkSpeed2 = atkSpeed2;
    this.atkSpeed3 = atkSpeed3;
  }
}

function makeNe(
  cost,
  cooldown,
  width,
  height,
  speed,
  color,
  hp,
  atk,
  atkType,
  atkRange,
  atkSpeed1,
  atkSpeed2,
  atkSpeed3
) {
  nekoMap.set(
    neId,
    new Neko(
      cost,
      cooldown,
      width,
      height,
      speed,
      color,
      hp,
      atk,
      atkType,
      atkRange,
      atkSpeed1,
      atkSpeed2,
      atkSpeed3
    )
  );
  neId += 1;
}

function makeWan(
  reward,
  width,
  height,
  speed,
  color,
  hp,
  atk,
  atkType,
  atkRange,
  atkSpeed1,
  atkSpeed2,
  atkSpeed3
) {
  wankoMap.set(
    wanId,
    new Wanko(
      reward,
      width,
      height,
      speed,
      color,
      hp,
      atk,
      atkType,
      atkRange,
      atkSpeed1,
      atkSpeed2,
      atkSpeed3
    )
  );
  wanId += 1;
}

const handleResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    scale = document.body.clientWidth / mapW;
    canvas.width = document.body.clientWidth;
    canvas.height = canvas.width * 0.25;
    ctx.scale(scale, scale);
  }, 500);
};
handleResize();

ctx.fillStyle = "#333";

ctx.strokeStyle = "black";
ctx.lineWidth = 1;

function drawEndline() {
  for (var j of [100, mapW - 100]) {
    for (var i = 0; i < mapH / 10; i++) {
      if (i % 2 == 1) {
        ctx.beginPath();
        ctx.moveTo(j, 10 * i);
        ctx.lineTo(j, 10 * (i + 1));
        ctx.stroke();
      }
    }
  }
}

function drawNe(neko) {
  ctx.fillStyle = neko.color;
  ctx.fillRect(neko.x, neko.y, neko.width, neko.height);
}

function drawWan(wanko) {
  ctx.fillStyle = wanko.color;
  ctx.fillRect(wanko.x - wanko.width, wanko.y, wanko.width, wanko.height);
}

function draw() {
  ctx.clearRect(0, 0, mapW, mapH);
  for (var wanko of wankoMap.values()) {
    if (!wanko.lockon) {
      wanko.x += wanko.dx;
    }
    if (wanko.hp <= 0) {
      wankoMap.delete(wanko.id);
    }
    drawWan(wanko);
  }

  for (var neko of nekoMap.values()) {
    if (!neko.lockon) {
      neko.x += neko.dx;
    }
    if (neko.hp <= 0) {
      nekoMap.delete(neko.id);
    }
    drawNe(neko);
  }

  drawEndline();
  detectEnemyWanko();
  detectEnemyNeko();
}

function disableBtn() {
  // classList.add("mystyle");
  // classList.remove("mystyle");
}

function detectEnemyWanko() {
  for (var neko of nekoMap.values()) {
    const detStart = neko.x + 320;
    const detEnd = neko.x - neko.atkRange;
    const wankoInRange = [...wankoMap].filter(
      ([id, wanko]) => detStart >= wanko.x && detEnd <= wanko.x
    );
    if (wankoInRange.length) {
      neko.lockon = true;
      if (neko.atkState == 0) {
        neko.atkState = -1;
        setTimeout(() => {
          neko.atkState = 1;
        }, neko.atkSpeed1);
      } else if (neko.atkState == 1) {
        neko.atkState = -1;
        setTimeout(() => {
          if (neko.atkType == "single") {
            wankoMap.get(wankoInRange[0][0]).hp -= neko.atk;
          } else if (neko.atkType == "area") {
            [...wankoInRange].map(
              ([id, wanko]) => (wankoMap.get(id).hp -= neko.atk)
            );
          }
          neko.atkState = 2;
        }, neko.atkSpeed2);
      } else if (neko.atkState == 2) {
        neko.atkState = -1;
        setTimeout(() => {
          neko.atkState = 0;
        }, neko.atkSpeed3);
      }
    } else {
      neko.lockon = false;
      neko.atkState = 0;
    }
  }
}

function detectEnemyNeko() {
  for (var wanko of wankoMap.values()) {
    const detStart = wanko.x - 320;
    const detEnd = wanko.x + wanko.atkRange;
    const nekoInRange = [...nekoMap].filter(
      ([id, neko]) => detStart <= neko.x && detEnd >= neko.x
    );
    if (nekoInRange.length) {
      wanko.lockon = true;
      if (wanko.atkState == 0) {
        wanko.atkState = -1;
        setTimeout(() => {
          wanko.atkState = 1;
        }, wanko.atkSpeed1);
      } else if (wanko.atkState == 1) {
        wanko.atkState = -1;
        setTimeout(() => {
          if (wanko.atkType == "single") {
            nekoMap.get(nekoInRange[0][0]).hp -= wanko.atk;
          } else if (wanko.atkType == "area") {
            [...nekoInRange].map(
              ([id, neko]) => (nekoMap.get(id).hp -= wanko.atk)
            );
          }
          wanko.atkState = 2;
        }, wanko.atkSpeed2);
      } else if (wanko.atkState == 2) {
        wanko.atkState = -1;
        setTimeout(() => {
          wanko.atkState = 0;
        }, wanko.atkSpeed3);
      }
    } else {
      wanko.lockon = false;
      wanko.atkState = 0;
    }
  }
}

function stage1() {
  // 처음 1마리 소환
  // 600F 뒤부터 300F마다 소환
  // 성 체력 50% 이하 30F 간격으로 8개
  makeWan(
    15,
    200,
    200,
    5,
    "gold",
    100,
    8,
    "single",
    110,
    29 * FRAMES,
    8 * FRAMES,
    10 * FRAMES
  );
  setTimeout(() => {
    stage1Timer = setInterval(() => {
      makeWan(
        15,
        200,
        200,
        5,
        "gold",
        100,
        8,
        "single",
        110,
        29 * FRAMES,
        8 * FRAMES,
        10 * FRAMES
      );
    }, 300 * FRAMES);
  }, 600 * FRAMES);
}

function startGame() {
  clearInterval(gameTimer);
  clearInterval(stage1Timer);
  nekoMap = new Map();
  neId = 0;
  wankoMap = new Map();
  wanId = 0;

  currentMoney = 0;
  moneyPerFrame = 0.3;
  maxMoney = 500;
  moneyLevel = 1;

  stage1();

  gameTimer = setInterval(draw, FRAMES);
}

startGame();

// (cost,
//   cooldown,
//   width,
//   height,
//   speed,
//   color,
//   hp,
//   atk,
//   atkType,
//   atkRange,
//   atkSpeed1,
//   atkSpeed2,
//   atkSpeed3
// )
ne1Btn.addEventListener("click", () => {
  makeNe(
    50,
    160 * FRAMES,
    200,
    200,
    10,
    "brown",
    100,
    8,
    "single",
    140,
    19 * FRAMES,
    8 * FRAMES,
    10 * FRAMES
  );
});
ne2Btn.addEventListener("click", () => {
  makeNe(
    100,
    250 * FRAMES,
    180,
    400,
    8,
    "green",
    400,
    2,
    "area",
    110,
    51 * FRAMES,
    8 * FRAMES,
    8 * FRAMES
  );
});
ne3Btn.addEventListener("click", () => {
  makeNe(
    400,
    340 * FRAMES,
    180,
    400,
    8,
    "silver",
    400,
    100,
    "single",
    350,
    111 * FRAMES,
    8 * FRAMES,
    8 * FRAMES
  );
});

resetBtn.addEventListener("click", startGame);

window.addEventListener("resize", handleResize);
