// 20201148 정인영

let poseNet;
let poses = [];
let handIsUp = false;
var imgs = [];
var audios = [];
let words = [];
let stars = [];
let isPlay = false;
let isPressed = false;
let isIntro = false;
let isVisibleAlert = false;
let textList = {
  2001: [
    "윙크",
    "오른쪽 다리의 흉터",
    "2001-12-14",
    "고양이띠",
    "강남성모병원",
    "제왕절개",
  ],
  2004: [
    "찬송가",
    "뽀로로",
    "주공아파트",
    "양천구",
    "바쿠간",
    "롯데백화점",
    "안양천",
    "구일유치원",
  ],
  2006: [
    "엄마 생일",
    "교회 가는 날",
    "아이스크림 케이크",
    "나쁜 도영이",
    "아빠와 야구하기",
    "엄마와 케이크만들기",
  ],
  2012: [
    "일본 오키나와 여행",
    "공부하기",
    "중국 베이징 여행",
    "카자흐스탄 여행",
    "이스탄불 여행",
    "바르셀로나 여행",
  ],
};
let objectListByYear = {};

var imgNames = [
  "assets/logo/2001.png",
  "assets/logo/01_text.png",
  "assets/logo/2004.png",
  "assets/logo/04_text.png",
  "assets/logo/2006.png",
  "assets/logo/06_text.png",
  "assets/logo/2023.jpg",
];
var audioNames = [
  "assets/mp3/2001.mp3",
  "assets/mp3/2004.mp3",
  "assets/mp3/2003.mp3",
  "assets/mp3/2004.mp3",
  "assets/mp3/2005.mp3",
  "assets/mp3/2006.mp3",
  "assets/mp3/2023.mp3",
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
let wordList1 = [{ name: "정인영" }, { name: "이대목동병원" }];
function preload() {
  // Pre-load all images.
  for (var i = 0; i < imgNames.length; i++) {
    var newImg = loadImage(imgNames[i]);
    imgs.push(newImg);
  }

  for (let i = 0; i < audioNames.length; i++) {
    var newAudio = loadSound(audioNames[i]);
    audios.push(newAudio);
  }
  mouseImage1 = loadImage("./assets/logo/hand.png");
  mouseImage2 = loadImage("./assets/logo/rock.png");
  sfFontRegular = loadFont(
    "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff"
  );
  sfFontMedium = loadFont("assets/font/SFPRODISPLAYMEDIUM.OTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createVideo(["./assets/logo/video.mov"]);
  video.hide(); // 비디오 요소를 숨김
  clear();
  noCursor();
  createStars();
  fft = new p5.FFT();
  for (const year in textList) {
    if (textList.hasOwnProperty(year)) {
      const textArray = textList[year];
      const yearObjectList = [];
      const existingXCoordinates = [];
      const existingYCoordinates = [];

      for (let i = 0; i < textArray.length; i++) {
        const text = textArray[i];
        const xCoordinate = generateNonOverlappingCoordinates(
          existingXCoordinates,
          (windowWidth / 6) * 1,
          (windowWidth / 6) * 5
        );
        const yCoordinate = generateNonOverlappingCoordinates(
          existingYCoordinates,
          (windowHeight / 4) * 1,
          (windowHeight / 4) * 3
        );

        const newObject = {
          text: text,
          x: xCoordinate,
          y: yCoordinate,
        };

        yearObjectList.push(newObject);
        existingXCoordinates.push(xCoordinate);
        existingYCoordinates.push(yCoordinate);
      }

      objectListByYear[year] = yearObjectList;
    }
  }
  nextImage();
}

function draw() {
  background(0);
  textFont(sfFontRegular);
  textAlign(CENTER, CENTER); // 텍스트 정렬 설정: 중앙 정렬

  if (isVisibleAlert) {
    textSize(30);
    stroke(255, 255, 255);
    strokeWeight(1);
    text(
      "틀렸습니다! 올바른 텍스트를 골라주세요.",
      windowWidth / 2,
      windowHeight - 100
    );
    noStroke();
  }
  for (let i = 0; i < stars.length; i++) {
    stars[i].display(); // 각 별을 표시
    stars[i].twinkle(); // 반짝거림 효과
  }

  switch (imgIndex) {
    case 0:
      for (let i = 0; i < objectListByYear[2001].length; i++) {
        textSize(16);
        fill("white");
        text(
          objectListByYear[2001][i].text,
          objectListByYear[2001][i].x,
          objectListByYear[2001][i].y
        );
        noFill();
        textSize(50);
        fill("white");
        text("2001년의 기억", 250, 120);
        textSize(24);
        text(
          "Enter 키를 눌러 해당 연도의 음성을 들어보세요.",
          windowWidth / 2,
          640
        );
      }
      break;
    case 1:
      textSize(50);
      fill("white");
      text("2001년의 인영이가 보낸 편지", 450, 120);
      textSize(20);
      text("다음 편지 확인하기", windowWidth / 2, 640);
      textSize(15);
      text("버튼 위에서 주먹을 쥐세요.", windowWidth / 2, 690);
      break;

    case 2:
      for (let i = 0; i < objectListByYear[2004].length; i++) {
        textSize(16);
        fill("white");
        text(
          objectListByYear[2004][i].text,
          objectListByYear[2004][i].x,
          objectListByYear[2004][i].y
        );
        noFill();
        textSize(50);
        fill("white");
        text("2004년의 기억", 250, 120);
      }
      break;
    case 3:
      textSize(50);
      fill("white");
      text("2004년의 인영이가 보낸 편지", 450, 120);
      textSize(20);
      text("다음 편지 확인하기", windowWidth / 2, 640);
      textSize(15);
      text("버튼 위에서 주먹을 쥐세요.", windowWidth / 2, 690);
      break;
    case 4:
      for (let i = 0; i < objectListByYear[2006].length; i++) {
        textSize(16);
        fill("white");
        text(
          objectListByYear[2006][i].text,
          objectListByYear[2006][i].x,
          objectListByYear[2006][i].y
        );
        noFill();
        textSize(50);
        fill("white");
        text("2006년의 기억", 330, 120);
      }
      break;

    case 5:
      textSize(50);
      fill("white");
      text("2006년의 인영이가 보낸 편지", 450, 120);
      textSize(20);
      text("다음 편지 확인하기", windowWidth / 2, 640);
      textSize(15);
      text("버튼 위에서 주먹을 쥐세요.", windowWidth / 2, 690);
      break;
    case 6:
      noFill();
      textSize(50);
      fill("white");
      text("2023년 12월 21일 04:37", 380, 120);
  }

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
  let yPos = window.sharedData.handData?.landmarks[0][9].y;

  // CURSOR MAPPING

  let mappedX = map(
    xPos,
    1,
    0,
    (window.screen.width / 7) * 1,
    (window.screen.width / 7) * 6
  );
  let mappedY = map(
    yPos,
    0,
    1,
    (window.screen.height / 7) * 1,
    (window.screen.height / 7) * 6
  );
  image(mouseImage1, mappedX, mappedY, 30, 30);

  // 단어 catch했을 때의 로직..
  if (
    window.sharedData.handData?.gestures[0][0].categoryName == "Closed_Fist"
  ) {
    image(mouseImage2, mappedX, mappedY, 30, 30);
    if (imgIndex == 0) {
      for (let i = 0; i < objectListByYear[2001].length; i++) {
        if (
          dist(
            mappedX,
            mappedY,
            objectListByYear[2001][i].x,
            objectListByYear[2001][i].y
          ) < 20
        ) {
          if (i == 0) {
            isVisibleAlert = false;
            nextImage();
            return;
            break;
          } else {
            isVisibleAlert = true;
            return;
          }
        }
      }
    } else if (imgIndex == 1) {
      if (dist(mappedX, mappedY, windowWidth / 2, 640) < 10) {
        nextImage();
      }
    } else if (imgIndex == 2) {
      for (let i = 0; i < objectListByYear[2004].length; i++) {
        if (
          dist(
            mappedX,
            mappedY,
            objectListByYear[2004][i].x,
            objectListByYear[2004][i].y
          ) < 10
        ) {
          if (i == 0) {
            isVisibleAlert = false;
            nextImage();
            break;
            return;
          } else {
            isVisibleAlert = true;
            break;
          }
        }
      }
    } else if (imgIndex == 3) {
      if (dist(mappedX, mappedY, windowWidth / 2, 640) < 10) {
        nextImage();
      }
    } else if (imgIndex == 4) {
      for (let i = 0; i < objectListByYear[2003].length; i++) {
        if (
          dist(
            mappedX,
            mappedY,
            objectListByYear[2003][i].x,
            objectListByYear[2003][i].y
          ) < 10
        ) {
          if (i == 0) {
            isVisibleAlert = false;

            nextImage();
            break;
            return;
          } else {
            isVisibleAlert = true;
            break;
          }
        }
      }
    }
  }
  // 비디오 크기 설정
  let videoWidth = 400;
  let videoHeight = 300;
  // 비디오 위치 설정 (화면 중앙)
  let videoX = (width - videoWidth) / 2;
  let videoY = (height - videoHeight) / 2;
  image(video, videoX, videoY, videoWidth, videoHeight);
}
function mousePressed() {
  if (video.isPlaying()) {
    video.pause();
  } else {
    video.loop();
  }
}
function keyPressed() {
  // Check if the key pressed is Enter (keyCode 13)
  if (keyIsPressed && keyCode === ENTER) {
    if (isPlay) {
      // If already playing, pause the audio
      audios[imgIndex].pause();
      isPlay = false;
    } else {
      // If not playing, play the audio
      audios[imgIndex].play();
      isPlay = true;
    }
  }
  // Additional logic for other key presses if needed
}

function createStars() {
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
    beginShape();
    vertex(this.x, this.y);
    for (var i = 0; i < 2; i++) {
      var controlPointX = this.x + random(-5, 5);
      var controlPointY = this.y + random(-5, 5);
      var endPointX = this.x + random(-5, 5);
      var endPointY = this.y + random(-5, 5);
      bezierVertex(
        controlPointX,
        controlPointY,
        controlPointX,
        controlPointY,
        endPointX,
        endPointY
      );
    }
    endShape();
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
