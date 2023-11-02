//  Group3 Team Project - Generative Design System
//  Final Output : Electronic Magnetic field

// Declare global variables for sliders and color picker
let rotationSlider;
let sizeSlider;
let colorPicker;

// Number of shapes and arrays to store their properties
let numShapes = 100;
let shapeVertices = new Array(numShapes);
let startingPositions = new Array(numShapes);
let rotation = new Array(numShapes);
let rotationSpeed = new Array(numShapes);
let sizes = new Array(numShapes);
let colors = new Array(numShapes);

function setup() {
  // Create a canvas with WEBGL renderer
  createCanvas(1200, 768, WEBGL);
  background(0);

  // Create rotation slider and position it
  rotationSlider = createSlider(0, 0.1, 0, 0.01);
  rotationSlider.position(10, 10);

  // Create size slider and position it
  sizeSlider = createSlider(10, 100, 50, 1);
  sizeSlider.position(10, 40);

  // Create color picker and position it
  colorPicker = createColorPicker(color(255, 0, 0));
  colorPicker.position(10, 70);

  // Initialize the shapes
  initializeShapes();
}

function draw() {
  // Clear the background to black
  background(0);

  // Translate and rotate the 3D scene
  translate(width / 30, height / 30, -200);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);

  // Iterate through each shape
  for (let i = 0; i < numShapes; i++) {
    push();

    // Apply rotation to the current shape
    rotate(rotation[i]);

    // Apply scaling to the current shape
    scale(sizes[i]);

    // Fill the shape with a color, and add stroke if a random condition is met
    fill(0);
    if (random() < 0.3) {
      fill(colors[i]);
      strokeWeight(random(1, 5));
      stroke(255, 255, 0);
    }

    // Create an array to hold vertices based on shapeVertices and startingPositions
    let vertices = [];
    for (let j = 0; j < 4; j++) {
      vertices[j] = p5.Vector.add(shapeVertices[i][j], startingPositions[i]);
    }

    // Draw the shape by connecting vertices with lines
    for (let k = 0; k < 4; k++) {
      beginShape();
      for (let j = 0; j < 4; j++) {
        vertex(vertices[j].x, vertices[j].y, vertices[j].z);
        vertices[j].add(p5.Vector.fromAngle(rotation[i]).mult(2));
      }
      endShape(CLOSE);
      rotate(HALF_PI);
    }

    pop();

    // Update the rotation of the current shape
    rotation[i] += rotationSpeed[i];

    // Check if the shape is out of the view and initialize it again
    if (startingPositions[i].mag() > width / 2) {
      initializeShape(i);
    }
  }
}


// Function to initialize the properties of a single shape
function initializeShape(i) {
  // Create an array to hold the shape's vertices
  shapeVertices[i] = new Array(4);

  // Generate random angles, radii, and z values for the vertices of the shape
  for (let j = 0; j < 4; j++) {
    let angle = map(noise(j, i), 0, 1, 0, TWO_PI);
    let radius = map(noise(i, j), 0, 1, 10, 100);
    let z = map(noise(i, j), 0, 1, -50, 50);
    shapeVertices[i][j] = createVector(cos(angle) * radius, sin(angle) * radius, z);
  }

  // Set a random initial rotation for the shape
  rotation[i] = random(TWO_PI);

  // Set a random rotation speed within the range defined by the slider
  rotationSpeed[i] = random(-rotationSlider.value(), rotationSlider.value());

  // Set the size of the shape based on the slider value
  sizes[i] = sizeSlider.value() / 50.0;

  // Set the color of the shape based on the color picker
  colors[i] = colorPicker.color();

  // Set a random starting position for the shape within the canvas
  startingPositions[i] = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
}



// Function to initialize properties of all shapes
function initializeShapes() {
  for (let i = 0; i < numShapes; i++) {
    // Initialize the properties of each shape
    initializeShape(i);
  }
}



function mousePressed() {
  for (let i = 0; i < numShapes; i++) {
    rotationSpeed[i] = random(-rotationSlider.value(), rotationSlider.value());
    sizes[i] = sizeSlider.value() / 50.0;
    colors[i] = colorPicker.color();
  }
}
