// 20201148
// Advertisement of Apple.

var imgs = [];
var imgNames = ["logo/white.svg", "logo/rainbow.png"];

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

  // Change to first image.
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
}

function keyPressed() {
  nextImage();
}
