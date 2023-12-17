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

function mousePressed() {
  if (isPressed) {
    audio.pause();
    isPressed = false;
  } else {
    isPressed = true;
    audio.loop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // For a cool effect try uncommenting this line
  // And comment out the background() line in draw
  // stroke(255, 50);
  clear();
  fft = new p5.FFT();
  nextImage();
}

function draw() {
  background(0);
  let spectrum = fft.analyze();
  amp = fft.getEnergy(20, 20000);
  console.log(amp);
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

  var randomValue = Math.random();

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
  if (Math.random() < 0.1) {
    imageMode(CENTER);
    image(imgs[1], width / 2, height / 2);
  }

  fill("#dee2e6");
  textAlign(CENTER);
  noStroke();
  textSize(40);
  textFont(sfFontRegular);
  text("2001년 12월 15일", 200, (windowHeight / 8) * 1);

  textSize(20);
  textFont(sfFontRegular);
  text("세상에 태어난 날", windowWidth / 2, (windowHeight / 12) * 11 - 30);
  textSize(12);
  text(
    "이정도로 많은 축복을 받은 적이 있었을까",
    windowWidth / 2,
    (windowHeight / 12) * 11
  );
}

function keyPressed() {
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
