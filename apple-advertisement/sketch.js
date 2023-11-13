// 20201148
// Advertisement of Apple.

var imgs = [];
var imgNames = [
  "assets/logo/1977.png",
  "assets/logo/2000.png",
  "assets/logo/2007.png",
  "assets/logo/sparkle.png",
  "assets/logo/white.svg",
  "assets/logo/1998.jpg",
];

var imgIndex = -1;
var loadPercentage = 0.045; // 0 to 1.0
var closeEnoughTarget = 50;
var allParticles = [];
var mouseSizeSlider;
var particleSizeSlider;
var speedSlider;
var resSlider;
var nextImageButton;

function preload() {
  // Pre-load all images.
  for (var i = 0; i < imgNames.length; i++) {
    var newImg = loadImage(imgNames[i]);
    imgs.push(newImg);
  }
  sfFontRegular = loadFont("assets/font/SFPRODISPLAYREGULAR.OTF");
  sfFontMedium = loadFont("assets/font/SFPRODISPLAYMEDIUM.OTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create on-screen controls.
  mouseSizeSlider = new SliderLayout("Mouse size", 50, 200, 100, 1, 100, 100);

  particleSizeSlider = new SliderLayout(
    "Particle size",
    1,
    20,
    8,
    1,
    100,
    mouseSizeSlider.slider.position().y + 70
  );

  speedSlider = new SliderLayout(
    "Speed",
    0,
    5,
    1,
    0.5,
    100,
    particleSizeSlider.slider.position().y + 70
  );

  resSlider = new SliderLayout(
    "Count multiplier (on next image)",
    0.1,
    2,
    1,
    0.1,
    100,
    speedSlider.slider.position().y + 70
  );

  nextImageButton = createButton("Next image");
  nextImageButton.position(100, resSlider.slider.position().y + 40);
  nextImageButton.mousePressed(nextImage);
  nextImage();
}

function draw() {
  background(0);

  for (var i = allParticles.length - 1; i > -1; i--) {
    allParticles[i].move();
    allParticles[i].draw();

    if (allParticles[i].isKilled) {
      if (allParticles[i].isOutOfBounds()) {
        allParticles.splice(i, 1);
      }
    }
  }
  particleSizeSlider.display();
  resSlider.display();
  speedSlider.display();
  mouseSizeSlider.display();
  fill("#dee2e6");
  textAlign(CENTER);
  noStroke();
  textSize(30);
  textFont(sfFontMedium);
  text("Apple", windowWidth / 2, (windowHeight / 8) * 7);
  textSize(20);
  textFont(sfFontRegular);
  text("History of Innovation.", windowWidth / 2, (windowHeight / 12) * 11);
}

function keyPressed() {
  nextImage();
}
