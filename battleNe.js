const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ne1Btn = document.querySelector("#ne1");
const ne2Btn = document.querySelector("#ne2");
const neDelBtn = document.querySelector("#neDel");
const wan1Btn = document.querySelector("#wan1");
const wanDelBtn = document.querySelector("#wanDel");

const FRAMES = 1000 / 30;

canvas.width = 1000;
canvas.height = 400;
const mapW = canvas.width;
const mapH = canvas.height;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var wanko of wankoMap.values()) {
    drawWan(wanko);

    if (!wanko.lockon) {
      wanko.x += wanko.dx;
      if (wanko.x > mapW - 100) {
        wankoMap.delete(wanko.id);
      }
    }
  }

  for (var neko of nekoMap.values()) {
    drawNe(neko);

    if (!neko.lockon) {
      neko.x += neko.dx;
      if (neko.x < 100) {
        nekoMap.delete(neko.id);
      }
    }
  }

  drawEndline();
  encounter();
}

function disableBtn() {
  // classList.add("mystyle");
  // classList.remove("mystyle");
}

function encounter() {
  var frontNe = nekoMap.size
    ? Math.min(...Array.from(nekoMap.values()).map((item) => item.x))
    : 1100;
  var frontWan = wankoMap.size
    ? Math.max(...Array.from(wankoMap.values()).map((item) => item.x))
    : -100;

  for (var neko of nekoMap.values()) {
    if (neko.x - neko.atkRange <= frontWan) {
      neko.lockon = true;
    } else {
      neko.lockon = false;
    }
  }
  for (var wanko of wankoMap.values()) {
    if (wanko.x + wanko.atkRange >= frontNe) {
      wanko.lockon = true;
    } else {
      wanko.lockon = false;
    }
  }

  return { frontWan: frontWan, frontNe: frontNe };
}

setInterval(draw, FRAMES);

class Ne {
  constructor(width, height, speed, color, atkRange, atkCast, atkSpeed) {
    this.id = neId;
    this.width = width;
    this.height = height;
    this.x = mapW - 100 - width;
    this.y = mapH - height;
    this.dx = -speed;
    this.color = color;
    // this.hp = hp;
    this.lockon = false;
    this.atkRange = atkRange;
    this.atkCast = atkCast;
    this.atkSpeed = atkSpeed;
  }
}

class Wanko {
  constructor(width, height, speed, color, atkRange, atkCast, atkSpeed) {
    this.id = wanId;
    this.width = width;
    this.height = height;
    this.x = 100 + width;
    this.y = mapH - height;
    this.dx = speed;
    this.color = color;
    // this.hp = hp;
    this.lockon = false;
    this.atkRange = atkRange;
    this.atkCast = atkCast;
    this.atkSpeed = atkSpeed;
  }
}

var nekoMap = new Map();
var neId = 0;

var wankoMap = new Map();
var wanId = 0;

function makeNe(width, height, speed, color, atkRange, atkCast, atkSpeed) {
  nekoMap.set(
    neId,
    new Ne(width, height, speed, color, atkRange, atkCast, atkSpeed)
  );
  neId += 1;
}

function makeWan(width, height, speed, color, atkRange, atkCast, atkSpeed) {
  wankoMap.set(
    wanId,
    new Wanko(width, height, speed, color, atkRange, atkCast, atkSpeed)
  );
  wanId += 1;
}

// 1 s = 30 frame
// 1.23 s = 37 frame, 0.27 s = 8 frame. 2.23 s = 67 frame
// cat&dog movement 10, atkRange 140
// tank cat movement 8, atkRange 110
ne1Btn.addEventListener("click", () => {
  makeNe(100, 100, 10, "brown", 100, 37 * FRAMES, 8 * FRAMES);
});
ne2Btn.addEventListener("click", () => {
  makeNe(80, 200, 8, "green", 70, 67 * FRAMES, 8 * FRAMES);
});
wan1Btn.addEventListener("click", () => {
  makeWan(100, 100, 10, "gold", 100, 37 * FRAMES, 8 * FRAMES);
});

neDelBtn.addEventListener("click", () => {
  nekoMap.clear();
  neId = 0;
});
wanDelBtn.addEventListener("click", () => {
  wankoMap.clear();
  wanId = 0;
});
