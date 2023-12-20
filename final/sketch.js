// 20201148 정인영

let poseNet;
let poses = [];
let handIsUp = false;
var imgs = [];
let stars = [];
let isPlay = false;
let isPressed = false;
let isIntro = false;
var textList01 = ["Gangnam-seungmo hospospital", "2002-12-15", "Chung In Young", "Scarce in Right Leg"];

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
let mouseImage1, mouseImage2;
let fft;
let isBlend;
let wordList1 = [{name: "정인영"}, {name : "이대목동병원"}];
function preload() {
  // Pre-load all images.
  for (var i = 0; i < imgNames.length; i++) {
    var newImg = loadImage(imgNames[i]);
    imgs.push(newImg);
  }
  mouseImage1 = loadImage("./assets/logo/hand.png");
  mouseImage2 = loadImage("./assets/logo/rock.png");
  sfFontRegular = loadFont(
    "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff"
  );
  sfFontMedium = loadFont("assets/font/SFPRODISPLAYMEDIUM.OTF");
  audio = loadSound("assets/mp3/2003.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  clear();
  noCursor();
  createStars();
  fft = new p5.FFT();
  nextImage();
  
}

function draw() {
  background(0);
  for (let i = 0; i < stars.length; i++) {
    stars[i].display(); // 각 별을 표시
    stars[i].twinkle(); // 반짝거림 효과
  }
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
  textSize(10);
  textFont(sfFontRegular);
  text("LOVE", windowWidth / 2 - 40, windowHeight / 2);
  if (isPlay) {
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
  if (
    window.sharedData.handData?.gestures[0][0].categoryName !== "Closed_Fist"
  ) {
    for (var i = allParticles.length - 1; i > -1; i--) {
      allParticles[i].move();
      allParticles[i].draw();

      if (allParticles[i].isKilled) {
        if (allParticles[i].isOutOfBounds()) {
          allParticles.splice(i, 1);
        }
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
    imageMode(CENTER);
    ellipse(10, 20, 50, 100);
    image(imgs[imgIndex], width / 2, height / 2);
  }

  if (
    window.sharedData.handData?.gestures[0][0].categoryName == "Closed_Fist"
  ) {
    if (isPlay) {
      return;
    }
    audio.play();
    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
  }

  let mappedX = map(
    xPos,
    1,
    0,
    (window.screen.width / 5) * 2,
    (window.screen.width / 5) * 3
  );
  let mappedY = map(
    yPos,
    0,
    1,
    (window.screen.height / 5) * 1,
    (window.screen.height / 5) * 4
  );
  if (
    window.sharedData.handData?.gestures[0][0].categoryName == "Closed_Fist"
  ) {
    image(mouseImage2, mappedX, mappedY, 30,30);
  }
  else{
    image(mouseImage1, mappedX, mappedY,30,30);
  }
  noStroke();
  textSize(20);
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
  if (keyIsPressed && keyCode === D) {
    if (isPressed) {
      audio.pause();
      isPressed = false;
    } else {
      isPressed = true;
      audio.loop();
    }
  }
}

function generateWords() {
  for (let i = 0; i < 10; i++) {
    let word = {
      text: "Word" + i,
      x: random(1000),
      y: random(1000),
    };
    words.push(word);
  }
}



function createStars() {
  // 별들을 생성하고 배열에 추가하는 함수
  for (let i = 0; i < 1000; i++) {
    stars.push(new Star());
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0, 2);
    this.alpha = random(150, 255);
  }

  display() {
    fill(255, this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }

  twinkle() {
    if (random() > 0.95) {
      this.alpha = 255;
    } else {
      this.alpha = random(150, 255);
    }
  }
}
