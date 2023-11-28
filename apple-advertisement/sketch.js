// 20201148 정인영
// Advertising about Apple branding

let poseNet;
let poses = [];
let handIsUp = false; // Variable to track hand position
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
var loadPercentage = 0.045;
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

function modelReady() {
  select("#status").html("Model Loaded");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create on-screen controls.
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
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

function modelLoaded() {
  console.log("PoseNet model loaded");
}
function gotPoses(results) {
  poses = results;
  console.log(poses);
  if (poses.length > 0) {
    // Check if the hand is raised (you may need to adjust the keypoints index)
    handIsUp = poses[0].pose.keypoints[9].position.y < windowHeight / 2;
  }
}

function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
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
  console.log(poses[0]?.pose?.keypoints[5].position);
  console.log(windowHeight);
  if (
    poses.length > 0 &&
    poses[0].pose.keypoints[5].position.y < windowHeight / 2 
  ) {
    nextImage();
  }

  image(video, (width / 5) * 4, 0, width / 5, height / 3);
}

function keyPressed() {
  nextImage();
}
