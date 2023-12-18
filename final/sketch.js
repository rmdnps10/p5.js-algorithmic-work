// 20201148 정인영

let poseNet;
let poses = [];
let handIsUp = false;
var imgs = [];
let isPressed = false;
var imgNames = [
  "assets/logo/2001.png",
  "assets/logo/2002.png",
  "assets/logo/2003.png",
  "assets/logo/2004.png",
  "assets/logo/2005.png",
  "assets/logo/2006.png",
  "assets/logo/2011.png",
  "assets/logo/2012.png",
  "assets/logo/2014.png",
  "assets/logo/2017.jpeg",
  "assets/logo/2019.jpeg",
  "assets/logo/2020.png",
  "assets/logo/2021.png",
  "assets/logo/2022.jpg",
];

var imgIndex = -1;
const noiseScale = 0.01;
var loadPercentage = 0.045;
var closeEnoughTarget = 50;
var num = 1000;
var allParticles = [];

let fft;
let isBlend;
function preload() {
  // Pre-load all images.
  for (var i = 0; i < imgNames.length; i++) {
    var newImg = loadImage(imgNames[i]);
    imgs.push(newImg);
  }
  sfFontRegular = loadFont(
    "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff"
  );
  sfFontMedium = loadFont("assets/font/SFPRODISPLAYMEDIUM.OTF");
  audio = loadSound("assets/mp3/2005.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  clear();
  noCursor();
  fft = new p5.FFT();
  nextImage();
}

function draw() {
  background(0);
  console.log(window.sharedData.handData);
  let spectrum = fft.analyze();
  amp = fft.getEnergy(20, 20000);
  // for (let i = 0; i < spectrum.length * 2; i += 80) {
  //   let ratio = i / spectrum.length;
  //   let hue = map(i, 0, spectrum.length, 0, 255);
  //   let diameter = map(amp, 0, 100, 0, height * 0.75);
  //   fill(0, 0, 20, 50);
  //   let x = map(i, 0, spectrum.length, width / 2, width);
  //   ellipse(x, height / 2, diameter, diameter);
  //   x = map(i, 0, spectrum.length, width / 2, 0);
  //   ellipse(x, height / 2, diameter, diameter);
  // }

  if (isPressed) {
    blendMode(ADD);
    let yoff = 0.0;
    for (let i = 0; i <= 50; i++) {
      stroke(0 + i * 2);
      strokeWeight(0.5);
      noFill();
      beginShape();
      let xoff = 0;
      for (let x = -10; x <= width + 11; x += 5) {
        let y = map(noise(xoff, yoff + amp), 0, 2, 0, height);
        vertex(x, y + 130);
        xoff += 0.03;
      }
      yoff += 0.05;
      endShape();
    }
  }
  blendMode(BLEND);

  for (var i = allParticles.length - 1; i > -1; i--) {
    allParticles[i].move();
    allParticles[i].draw();

    if (allParticles[i].isKilled) {
      if (allParticles[i].isOutOfBounds()) {
        allParticles.splice(i, 1);
      }
    }
  }
  let xPos = window.sharedData.handData?.landmarks[0][9].x;
  console.log(xPos);
  let yPos = window.sharedData.handData?.landmarks[0][9].y;
  console.log(yPos);
  if (
    window.sharedData.handData?.gestures[0][0].categoryName == "Closed_Fist"
  ) {
    console.log("실행");
    imageMode(CENTER);
    ellipse(10, 20, 50, 100);
    image(imgs[imgIndex], width / 2, height / 2);
  }
  console.log(window.screen.width);
  console.log(window.screen.height);

  let mappedX = map(xPos, 1, 0, 0, window.screen.width);
  let mappedY = map(yPos, 0, 1, 0, window.screen.height);
  stroke(200, 0, 0);
  ellipse(mappedX, mappedY, 3, 3);
  noStroke();

  // if (Math.random() < 0.5) {
  //   imageMode(CENTER);
  //   image(imgs[3], width / 2, height / 2);
  // }

  // if (imgIndex == 0) {
  //   fill("#dee2e6");
  //   textAlign(CENTER);
  //   noStroke();
  //   textSize(40);
  //   textFont(sfFontRegular);
  //   text("2001.12.15", 200, (windowHeight / 8) * 1);

  //   textSize(2);
  //   textFont(sfFontRegular);
  //   text("Birth", windowWidth / 2, (windowHeight / 12) * 11 - 30);
  //   textSize(15);
  //   text(
  //     "출생",
  //     windowWidth / 3,
  //     (windowHeight / 12) * 6
  //   );
  // } else if (imgIndex == 1) {
  //   fill("#dee2e6");
  //   textAlign(CENTER);
  //   noStroke();
  //   textSize(40);
  //   textFont(sfFontRegular);
  //   text("2002년 3월 24일", 200, (windowHeight / 8) * 1);

  //   textSize(20);
  //   textFont(sfFontRegular);
  //   text("탄생 出 生", windowWidth / 2, (windowHeight / 12) * 11 - 30);
  //   textSize(12);
  //   text(
  //     "수많은 사람들의 축복 속에서 태어났다.",
  //     windowWidth / 2,
  //     (windowHeight / 12) * 11
  //   );
  // }
}

function keyPressed() {
  // Check if the key pressed is Enter (keyCode 13)
  if (keyIsPressed && keyCode === ENTER) {
    blendMode(BLEND);
    var currentTime = millis();
    // 처음 2초 동안은 blendMode(ADD)로 설정
    if (currentTime < 2000) {
      blendMode(ADD);
    } else {
      // 2초가 지나면 기본 블렌딩 모드로 설정
      blendMode(BLEND);
    }
    nextImage();
  }
  if (keyIsPressed && keyCode === SPACE) {
    if (isPressed) {
      audio.pause();
      isPressed = false;
    } else {
      isPressed = true;
      audio.loop();
    }
  }
}
