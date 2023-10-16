let sizeList = [80, 100, 150, 200];
let clickThreshold = 10;
let clickedCount = 0; // 클릭 횟수를 추적할 변수
let treeTraces = [];
function preload() {
  backgroundSeoul = loadImage("./assets/seoul.jpg");
  tree = loadImage("./assets/tree.png");
  missile = loadImage("./assets/fallingBomb.png");
  b_rocket = loadImage("./assets/b_rocket.png");
  s_rocket = loadImage("./assets/s_rocket.png");
  font = loadFont("./assets/typeWriter.otf");
}

function setup() {
  createCanvas(1500, 982);
  image(backgroundSeoul, 0, 0, 1500, 982);
}

function drawTree(x, y, scale) {
  let greenHeight = 600;
  let greenArea = tree.get(0, 0, tree.width, greenHeight);
  let brownArea = tree.get(0, greenHeight + 30, tree.width, tree.height - 20);
  tint(0, 255, 0);
  push();
  imageMode(CENTER);
  image(greenArea, x, y, 300 * scale, 100 * scale);
  tint(150, 75, 0);
  image(
    brownArea,
    x,
    y + 50 * scale + (250 * scale) / 2 - 10,
    300 * scale,
    250 * scale
  );
  pop();
}

function drawBomb(x, y, scale) {
  let greenHeight = 600;
  let greenArea = tree.get(0, 0, tree.width, greenHeight);
  let brownArea = tree.get(0, greenHeight + 30, tree.width, tree.height - 20);
  noTint();
  push();
  imageMode(CENTER);
  image(greenArea, x, y, 300 * scale, 100 * scale);
  noTint();
  image(
    brownArea,
    x,
    y + 50 * scale + (250 * scale) / 2 - 10,
    300 * scale,
    250 * scale
  );
  pop();
}

function drawMissile() {
  for (let i = 0; i < treeTraces.length; i++) {
    if (treeTraces[i].isCenter) {
      push();
      imageMode(CENTER);
      image(missile, treeTraces[i].x, treeTraces[i].y - 200, 60, 170);
      pop();
    }
  }
}

function drawPlane() {
  image(b_rocket, 500, 50, 350, 120);
  image(s_rocket, 200, 30, 200, 70);
  image(s_rocket, 800, 170, 160, 50);
  image(s_rocket, 1000, 70, 160, 50);
  image(s_rocket, 1300, 190, 200, 70);
  image(s_rocket, 600, 300, 200, 70);
  image(s_rocket, 100, 250, 150, 40);
  image(s_rocket, 350, 180, 150, 40);
}

function carpetBombing() {
  let randomScale = random(0.5, 2); // scale 결정계수
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let probabitiy = random(1);
      if (probabitiy > 0.2) {
        xPos = mouseX - randomScale * 100 + 60 * i * randomScale;
        yPos =
          mouseY + 60 * randomScale - randomScale * 50 + 30 * randomScale * j;
        scale = randomScale * random(0.2, 0.5);
        drawTree(xPos, yPos, scale);

        // 나중에 후처리를 위한 트리에 좌표 기억
        treeTraces.push({ x: xPos, y: yPos, scale: scale, isCenter: false });
      }
    }
  }
  drawTree(mouseX, mouseY, randomScale);
  treeTraces.push({ x: mouseX, y: mouseY, scale: randomScale, isCenter: true });
}

function mouseClicked() {
  if (clickedCount > clickThreshold) {
    thisIsEnding();
    return;
  }

  carpetBombing();
  clickedCount++;
}
function thisIsEnding() {
  if (clickedCount > clickThreshold) {
    skyPortion = backgroundSeoul.get(0, 0, backgroundSeoul.width, 403);
    image(skyPortion, 0, 0);

    leftPortion = backgroundSeoul.get(
      0,
      400,
      backgroundSeoul.width,
      backgroundSeoul.height
    );

    let grid = 20;
    for (let c = 0; c < leftPortion.height; c += 20) {
      for (let w = 0; w < leftPortion.width; w += 20) {
        let stripXposition = int(random(100, leftPortion.width - 100));
        let stripWidth = 20;
        let stripHeight = 20;

        // Adjust the stripWidth if it goes beyond the right edge
        if (stripXposition + stripWidth > leftPortion.width) {
          stripWidth = leftPortion.width - stripXposition;
        }

        // Adjust the stripHeight if it goes beyond the bottom edge
        if (c + stripHeight > leftPortion.height) {
          stripHeight = leftPortion.height - c;
        }

        let strip = leftPortion.get(stripXposition, c, stripWidth, stripHeight);
        noTint();
        image(strip, w, c + 400, 20, 20);
      }
    }

    filter(GRAY);

    for (let i = 0; i < treeTraces.length; i++) {
      drawBomb(treeTraces[i].x, treeTraces[i].y, treeTraces[i].scale);
    }
    drawPlane();
    drawMissile();
    textSize(30);
    textFont(font);
    fill(255, 255, 255);
    text("This is what war is like.", 460, 270);
  }
}
