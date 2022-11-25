const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");
const ne1Btn = document.querySelector("#ne1");
const ne2Btn = document.querySelector("#ne2");
const ne3Btn = document.querySelector("#ne3");
const resetBtn = document.querySelector("#resetGame");

const FRAMES = 1000 / 30;
let resizeTimer;

let gameTimer;
let stage1WankoTimer;

const mapW = 4000;
const mapH = 1000;
let factor;

var nekoMap, neId, wankoMap, wanId;
var currentMoney;
var moneyPerFrame;
var maxMoney;
var moneyLevel;

let next = 0;

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
    this.x = mapW - 100;
    this.y = mapH - height - Math.floor(Math.random() * 51);
    this.dx = -speed;
    this.color = color;
    this.hp = hp;
    this.atk = atk;
    this.atkType = atkType;
    this.lockon = false;
    this.atkState = 0;
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
    this.x = 100;
    this.y = mapH - height - Math.floor(Math.random() * 51);
    this.dx = speed;
    this.color = color;
    this.hp = hp;
    this.atk = atk;
    this.atkType = atkType;
    this.lockon = false;
    this.atkState = 0;
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
    let newFactor = document.body.clientWidth / mapW;
    if (newFactor !== factor) {
      gameCanvas.width = document.body.clientWidth;
      gameCanvas.height = gameCanvas.width * 0.25;
      gameCtx.scale(newFactor, newFactor);
      factor = newFactor;
    }
  }, 0);
};
handleResize();

gameCtx.fillStyle = "#333";
gameCtx.strokeStyle = "black";
gameCtx.lineWidth = 1;

function drawMoney() {
  gameCtx.font = "normal bold 100px sans-serif";
  gameCtx.textAlign = "right";
  gameCtx.textBaseline = "top";
  gameCtx.fillStyle = "gold";
  gameCtx.fillText(
    `${parseInt(currentMoney)} / ${maxMoney} G`,
    mapW - 100,
    100
  );
}

function drawRoad() {
  gameCtx.fillStyle = "#6b5428";
  gameCtx.fillRect(0, mapH - 100, mapW, mapH);
}

function drawEndline() {
  gameCtx.lineWidth = "1";
  for (var j of [200, mapW - 200]) {
    for (var i = 0; i < mapH / 10; i++) {
      if (i % 2 == 1) {
        gameCtx.beginPath();
        gameCtx.moveTo(j, 10 * i);
        gameCtx.lineTo(j, 10 * (i + 1));
        gameCtx.stroke();
      }
    }
  }
}

var cat = cat;
var tankCat = tankCat;
var grossCat = grossCat;

var catBtns = [
  {
    query: ne1Btn,
    name: cat,
    cost: 50,
    cooldown: 160 * FRAMES,
    cooling: false,
  },
  {
    query: ne2Btn,
    name: tankCat,
    cost: 100,
    cooldown: 250 * FRAMES,
    cooling: false,
  },
  {
    query: ne3Btn,
    name: grossCat,
    cost: 400,
    cooldown: 340 * FRAMES,
    cooling: false,
  },
];

function handleBtn1() {
  const btn = catBtns[0];
  if (currentMoney >= btn.cost && !btn.cooling) {
    ne1Btn.addEventListener("click", btn.name);
    ne1Btn.classList.remove("disabled");
  } else {
    ne1Btn.removeEventListener("click", btn.name);
    ne1Btn.classList.add("disabled");
  }
}
function handleBtn2() {
  const btn = catBtns[1];
  if (currentMoney >= btn.cost && !btn.cooling) {
    ne2Btn.addEventListener("click", btn.name);
    ne2Btn.classList.remove("disabled");
  } else {
    ne2Btn.removeEventListener("click", btn.name);
    ne2Btn.classList.add("disabled");
  }
}
function handleBtn3() {
  const btn = catBtns[2];
  if (currentMoney >= btn.cost && !btn.cooling) {
    ne3Btn.addEventListener("click", btn.name);
    ne3Btn.classList.remove("disabled");
  } else {
    ne3Btn.removeEventListener("click", btn.name);
    ne3Btn.classList.add("disabled");
  }
}

function handleButtons() {
  handleBtn1();
  handleBtn2();
  handleBtn3();
}

function drawNe(neko) {
  gameCtx.fillStyle = neko.color;
  gameCtx.fillRect(neko.x, neko.y, neko.width, neko.height);
  gameCtx.strokeStyle = "black";
  gameCtx.lineWidth = "10";
  gameCtx.lineJoin = "bevel";
  gameCtx.strokeRect(neko.x, neko.y, neko.width, neko.height);
}

function drawWan(wanko) {
  gameCtx.fillStyle = wanko.color;
  gameCtx.fillRect(wanko.x - wanko.width, wanko.y, wanko.width, wanko.height);
  gameCtx.strokeStyle = "black";
  gameCtx.lineWidth = "10";
  gameCtx.lineJoin = "bevel";
  gameCtx.strokeRect(wanko.x - wanko.width, wanko.y, wanko.width, wanko.height);
}

function gameFlow() {
  gameCtx.clearRect(0, 0, mapW, mapH);

  drawRoad();
  drawEndline();
  drawMoney();
  handleButtons();
  handleWankoAtk();
  handleNekoAtk();

  [...wankoMap].forEach(([id, wanko]) => {
    if (!wanko.lockon) {
      wanko.x += wanko.dx;
    }
    if (wanko.hp <= 0 || wanko.x > mapW) {
      currentMoney = Math.min(currentMoney + wanko.reward, maxMoney);
      wankoMap.delete(wanko.id);
    }
    drawWan(wanko);
  });

  [...nekoMap].forEach(([id, neko]) => {
    if (!neko.lockon) {
      neko.x += neko.dx;
    }
    if (neko.hp <= 0 || neko.x < 0) {
      nekoMap.delete(neko.id);
    }
    drawNe(neko);
  });

  currentMoney = Math.min(currentMoney + moneyPerFrame, maxMoney);
}

function findEnemyWanko(neko) {
  const start = neko.x + 320;
  const end = neko.x - neko.atkRange;
  const wankoInRange = [...wankoMap].filter(
    ([id, wanko]) => start >= wanko.x && end <= wanko.x
  );
  return wankoInRange;
}

function findEnemyNeko(wanko) {
  const start = wanko.x - 320;
  const end = wanko.x + wanko.atkRange;
  const nekoInRange = [...nekoMap].filter(
    ([id, neko]) => start <= neko.x && end >= neko.x
  );
  return nekoInRange;
}

function handleNekoAtk() {
  nekoMap.forEach((neko) => {
    if (neko.atkState == 0) {
      var wankoInRange = findEnemyWanko(neko);
      if (wankoInRange.length) {
        neko.lockon = true;
        neko.atkState = -1;
        setTimeout(() => {
          neko.atkState = 1;
        }, neko.atkSpeed1);
      } else {
        neko.lockon = false;
      }
    } else if (neko.atkState == 1) {
      wankoInRange = findEnemyWanko(neko);
      if (wankoInRange.length) {
        neko.atkState = -2;
        setTimeout(() => {
          wankoInRange = findEnemyWanko(neko);
          if (wankoInRange.length) {
            if (neko.atkType == "single") {
              wankoMap.get(wankoInRange[0][0]).hp -= neko.atk;
            } else if (neko.atkType == "area") {
              [...wankoInRange].map(
                ([id, wanko]) => (wankoMap.get(id).hp -= neko.atk)
              );
            }
          }
          neko.atkState = 2;
        }, neko.atkSpeed2);
      } else {
        neko.atkState = 0;
      }
    } else if (neko.atkState == 2) {
      neko.atkState = -3;
      setTimeout(() => {
        neko.atkState = 0;
      }, neko.atkSpeed3);
    }
  });
}

function handleWankoAtk() {
  wankoMap.forEach((wanko) => {
    if (wanko.atkState == 0) {
      var nekoInRange = findEnemyNeko(wanko);
      if (nekoInRange.length) {
        wanko.lockon = true;
        wanko.atkState = -1;
        setTimeout(() => {
          wanko.atkState = 1;
        }, wanko.atkSpee1);
      } else {
        wanko.lockon = false;
      }
    } else if (wanko.atkState == 1) {
      nekoInRange = findEnemyNeko(wanko);
      if (nekoInRange.length) {
        wanko.atkState = -2;
        setTimeout(() => {
          nekoInRange = findEnemyNeko(wanko);
          if (nekoInRange.length) {
            if (wanko.atkType == "single") {
              nekoMap.get(nekoInRange[0][0]).hp -= wanko.atk;
            } else if (wanko.atkType == "area") {
              [...nekoInRange].map(
                ([id, neko]) => (nekoMap.get(id).hp -= wanko.atk)
              );
            }
          }
          wanko.atkState = 2;
        }, wanko.atkSpeed2);
      } else {
        wanko.atkState = 0;
      }
    } else if (wanko.atkState == 2) {
      wanko.atkState = -3;
      setTimeout(() => {
        wanko.atkState = 0;
      }, wanko.atkSpeed3);
    }
  });
}

function changeRegen() {
  next = Math.floor(Math.random() * 121);
}

function stage1() {
  // 처음 1마리 소환
  // 600F 뒤부터 300~180F마다 소환
  // 성 체력 50% 이하 30F 간격으로 8개
  makeWan(
    15,
    320,
    320,
    5,
    "gold",
    100,
    8,
    "single",
    110,
    31 * FRAMES,
    8 * FRAMES,
    8 * FRAMES
  );

  stage1WankoTimer = setInterval(() => {
    setTimeout(() => {
      makeWan(
        15,
        320,
        320,
        5,
        "gold",
        100,
        8,
        "single",
        110,
        31 * FRAMES,
        8 * FRAMES,
        8 * FRAMES
      );
      changeRegen();
    }, next * FRAMES);
  }, 300 * FRAMES);
}

function stage1Clear() {
  clearInterval(stage1WankoTimer);
}

function startGame() {
  clearInterval(gameTimer);
  clearInterval(stage1WankoTimer);
  nekoMap = new Map();
  neId = 0;
  wankoMap = new Map();
  wanId = 0;

  currentMoney = 0;
  moneyPerFrame = 0.3;
  maxMoney = 500;
  moneyLevel = 1;

  stage1();

  gameTimer = setInterval(gameFlow, FRAMES);
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

function cat() {
  if (currentMoney >= 50) {
    currentMoney -= 50;
    makeNe(
      50,
      160 * FRAMES,
      320,
      320,
      10,
      "brown",
      100,
      8,
      "single",
      140,
      21 * FRAMES,
      8 * FRAMES,
      8 * FRAMES
    );

    catBtns[0].cooling = true;
    setTimeout(() => {
      catBtns[0].cooling = false;
    }, catBtns[0].cooldown);
  }
}

function tankCat() {
  if (currentMoney >= 100) {
    currentMoney -= 100;
    makeNe(
      100,
      250 * FRAMES,
      320,
      640,
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
    catBtns[1].cooling = true;
    setTimeout(() => {
      catBtns[1].cooling = false;
    }, catBtns[1].cooldown);
  }
}

function grossCat() {
  if (currentMoney >= 400) {
    currentMoney -= 400;
    makeNe(
      400,
      340 * FRAMES,
      320,
      800,
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
    catBtns[2].cooling = true;
    setTimeout(() => {
      catBtns[2].cooling = false;
    }, catBtns[2].cooldown);
  }
}

resetBtn.addEventListener("click", startGame);

window.addEventListener("resize", handleResize);
