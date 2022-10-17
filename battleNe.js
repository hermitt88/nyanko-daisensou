const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ne1Btn = document.querySelector("#ne1");
const ne2Btn = document.querySelector("#ne2");
const neDelBtn = document.querySelector("#neDel");
const wan1Btn = document.querySelector("#wan1");
const wanDelBtn = document.querySelector("#wanDel");

const FRAMES = 1000 / 30;
let timer;

const mapW = 4000;
const mapH = 1000;
scale = document.body.clientWidth / 4000;
canvas.width = document.body.clientWidth;
canvas.height = canvas.width * 0.25;
ctx.scale(scale, scale);

const handleResize = () => {
  clearTimeout(timer);
  timer = setTimeout(function () {
    scale = document.body.clientWidth / 4000;
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
    if (wanko.hp <= 0 || wanko.x > mapW - 100) {
      wankoMap.delete(wanko.id);
    }
    drawWan(wanko);
  }

  for (var neko of nekoMap.values()) {
    if (!neko.lockon) {
      neko.x += neko.dx;
    }
    if (neko.hp <= 0 || neko.x < 100) {
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
      if (neko.atkState == -1) {
        neko.atkState = 3;
        setTimeout(() => {
          neko.atkState = 0;
        }, neko.atkCast);
      } else if (neko.atkState == 0) {
        if (neko.atkType == "single") {
          wankoMap.get(wankoInRange[wankoInRange.length - 1][0]).hp -= neko.atk;
        } else if (neko.atkType == "area") {
          [...wankoInRange].map(
            ([id, wanko]) => (wankoMap.get(id).hp -= neko.atk)
          );
        }
        neko.atkState = 1;
      } else if (neko.atkState == 1) {
        neko.atkState = 3;
        setTimeout(() => {
          neko.atkState = -1;
        }, neko.atkSpeed - neko.atkCast);
      }
    } else {
      neko.lockon = false;
      neko.atkState = -1;
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
      if (wanko.atkState == -1) {
        wanko.atkState = 3;
        setTimeout(() => {
          wanko.atkState = 0;
        }, wanko.atkCast);
      } else if (wanko.atkState == 0) {
        if (wanko.atkType == "single") {
          nekoMap.get(nekoInRange[0][0]).hp -= wanko.atk;
        } else if (wanko.atkType == "area") {
          [...nekoInRange].map(
            ([id, neko]) => (nekoMap.get(id).hp -= wanko.atk)
          );
        }
        wanko.atkState = 1;
      } else if (wanko.atkState == 1) {
        wanko.atkState = 3;
        setTimeout(() => {
          wanko.atkState = -1;
        }, wanko.atkSpeed - wanko.atkCast);
      }
    } else {
      wanko.lockon = false;
      wanko.atkState = -1;
    }
  }
}

setInterval(draw, FRAMES);

class Neko {
  constructor(
    cost,
    width,
    height,
    speed,
    color,
    hp,
    atk,
    atkType,
    atkRange,
    atkCast,
    atkSpeed
  ) {
    this.cost = cost;
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
    this.atkCast = atkCast;
    this.atkSpeed = atkSpeed;
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
    atkCast,
    atkSpeed
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
    this.atkCast = atkCast;
    this.atkSpeed = atkSpeed;
  }
}

var nekoMap = new Map();
var neId = 0;

var wankoMap = new Map();
var wanId = 0;

function makeNe(
  cost,
  width,
  height,
  speed,
  color,
  hp,
  atk,
  atkType,
  atkRange,
  atkCast,
  atkSpeed
) {
  nekoMap.set(
    neId,
    new Neko(
      cost,
      width,
      height,
      speed,
      color,
      hp,
      atk,
      atkType,
      atkRange,
      atkCast,
      atkSpeed
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
  atkCast,
  atkSpeed
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
      atkCast,
      atkSpeed
    )
  );
  wanId += 1;
}

// 1 s = 30 frame
// 1.23 s = 37 frame, 0.27 s = 8 frame. 2.23 s = 67 frame
ne1Btn.addEventListener("click", () => {
  makeNe(
    75,
    200,
    200,
    10,
    "brown",
    100,
    8,
    "single",
    140,
    37 * FRAMES,
    8 * FRAMES
  );
});
ne2Btn.addEventListener("click", () => {
  makeNe(
    150,
    180,
    400,
    8,
    "green",
    400,
    2,
    "area",
    110,
    67 * FRAMES,
    8 * FRAMES
  );
});
wan1Btn.addEventListener("click", () => {
  makeWan(
    15,
    200,
    200,
    10,
    "gold",
    100,
    8,
    "single",
    110,
    37 * FRAMES,
    8 * FRAMES
  );
});

neDelBtn.addEventListener("click", () => {
  nekoMap.clear();
  neId = 0;
});
wanDelBtn.addEventListener("click", () => {
  wankoMap.clear();
  wanId = 0;
});

window.addEventListener("resize", handleResize);
