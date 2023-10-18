// 20201148 정인영 - Project3 # Collage

// Title - Planting Tree in the city.

// Variable that stores the number of mouse clicks and coordinates
let clickThreshold = 10;
let clickedCount = 0;
let treeTraces = [];

// Preoload prequisite images and font
function preload() {
  backgroundSeoul = loadImage("./assets/seoul.jpg");
  tree = loadImage("./assets/tree.png");
  missile = loadImage("./assets/fallingBomb.png");
  b_rocket = loadImage("./assets/b_rocket.png");
  s_rocket = loadImage("./assets/s_rocket.png");
  font = loadFont("./assets/typeWriter.otf");
}

// draw background.
function setup() {
  createCanvas(1500, 982);
  image(backgroundSeoul, 0, 0, 1500, 982);
}

// The work unfolds by clicking the mouse.
// Until clickthresold is exceeded, the carpetBombing function is executed,
// and when it is exceeded, the thisIsEnding function is executed.
function mouseClicked() {
  if (clickedCount > clickThreshold) {
    thisIsEnding();
    return;
  }
  carpetBombing();
  clickedCount++;
}

// carpetBombing() : draw a collection of trees
function carpetBombing() {
  // decide scale of tree randomly
  let randomScale = random(0.5, 2);

  // draw small trees around the coordinates (isCenter : false)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let probabitiy = random(1);
      if (probabitiy > 0.2) {
        xPos = mouseX - randomScale * 100 + 60 * i * randomScale;
        yPos =
          mouseY + 60 * randomScale - randomScale * 50 + 30 * randomScale * j;
        scale = randomScale * random(0.2, 0.5);
        drawTree(xPos, yPos, scale);

        // Store coordinates in tree for later post-processing!
        treeTraces.push({ x: xPos, y: yPos, scale: scale, isCenter: false });
      }
    }
  }
  // draw main bing tree at the coordinates (isCenter : true)
  drawTree(mouseX, mouseY, randomScale);
  // Store coordinates in tree for later post-processing!
  treeTraces.push({ x: mouseX, y: mouseY, scale: randomScale, isCenter: true });
}

// drawTree() : draw 'one' Tree
function drawTree(x, y, scale) {
  let greenHeight = 600;
  // Separating the part of the image where I want to apply a different filter
  let greenArea = tree.get(0, 0, tree.width, greenHeight);
  let brownArea = tree.get(0, greenHeight + 30, tree.width, tree.height - 20);
  // apply Green Filter
  tint(0, 255, 0);
  push();
  imageMode(CENTER);
  image(greenArea, x, y, 300 * scale, 100 * scale);
  // apply Brown Filter
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

// thisIsEnding() : Function that draws the ending
function thisIsEnding() {
  if (clickedCount > clickThreshold) {


    // Divide the background photo into sky and rest.
    skyPortion = backgroundSeoul.get(0, 0, backgroundSeoul.width, 403);
    image(skyPortion, 0, 0);

    leftPortion = backgroundSeoul.get(
      0,
      400,
      backgroundSeoul.width,
      backgroundSeoul.height
    );
    // Divide the grid from 'leftPortion' and shuffle it horizontally.
    // The grid is built up through nested loops. (Horizontal -> Vertical)
    let grid = 20;
    for (let c = 0; c < leftPortion.height; c += grid) {
      for (let w = 0; w < leftPortion.width; w += grid) {
        let stripXposition = int(random(100, leftPortion.width - 100));
        let stripWidth = grid;
        let stripHeight = grid;

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
        image(strip, w, c + 400, grid, grid);
      }
    }

    // apply gray filter on background photo
    filter(GRAY);



    // draw mushroom clouds using drawBomb()
    for (let i = 0; i < treeTraces.length; i++) {
      drawBomb(treeTraces[i].x, treeTraces[i].y, treeTraces[i].scale);
    }

    // draw fighter planes and missiles 
    drawPlane();
    drawMissile();

    // draw artist's message 
    textSize(30);
    textFont(font);
    fill(255, 255, 255);
    text("This is what war is like.", 460, 270);
  }
}

// drawBomb: drawing mushroom clud
// alomost same with drawTree(), but there is no filter apply.
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

// drawMissile(): drawing several issiles directly on the mushroom cloud.
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

// drawPlane(): drawing figher planes
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
