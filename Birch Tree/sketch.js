// Birch Tree 20201148 정인영

// variables that represent max, min value of tree and sticks 
let tmaxLen;
let tminLen;
let smaxLen;
let sminLen;
// texture (color) of tree
let colKeep;


function setup() {
  createCanvas(windowWidth, windowHeight);
  loc = createVector(width * 0.5, height * 0.5);
  vel = createVector(random(-15, 15), random(-15, 15));
  tmaxLen = height * 0.13;
  tminLen = tmaxLen * 0.1;
  smaxLen = height * 0.05;
  sminLen = tmaxLen * 0.1;
}


function draw() {
  push();
  translate(width * 0.5, height * 0.95);
  
  // Main Logic: The treeMaker() draws a stick by calling stickmaker() through a loop, and stickmaker() calls leafMaker() again.
  for (let i = 0; i < 2; i++) {
    treeMaker(tmaxLen);
    for (let j = 0; j < 75; j++) {
      push();
      translate(random(-width * 0.1, width * 0.1), 0);
      grassMaker(smaxLen, random(-PI * 0.1, PI * 0.1));
      pop();
    }
  }
  pop();
  noLoop();
}

function grassMaker(len, theta) {
  push();
  translate(0, 0);
  rotate(theta);
  let sw = map(len, sminLen, smaxLen, 1, 5);
  strokeWeight(sw);
  stroke(0, random(50, 100), 0, 255);
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > sminLen) {
    // recursive method
    grassMaker(len * 0.7, theta * 1.1);
  }
  pop();
}


function treeMaker(len) {
  push();
  translate(0, 0);
  let theta = random(-PI * 0.2, PI * 0.2);

  // first segment is vertical.
  if (len < tmaxLen) {
    rotate(theta);
  } else {
    rotate(random(-PI * 0.1, PI * 0.1));
  }
  
  // calculates the stroke weight (sw) based on the length of the branch.


  let sw = map(len, tminLen, tmaxLen, 3, 12);
  strokeWeight(2);
  
 // The function enters a loop that draws the main branch of the tree. It iterates over the length of the branch and calculates the position and color for each part of the branch. It draws three segments for each part: highlight, mid-tone, and shadow, with varying stroke weights and colors.
  
  for (let y = 0; y < len * 1.05; y++) {
    let x = map(y, 0, len, sw, sw * 0.8);
    let col = map(x, 12, 3, 255, 75);
    colKeep = col;
    push();
    translate(random(-x * 0.12, x * 0.12), -y);

    // highlight
    stroke(col, 255);
    if (random() < 0.05) {
      stroke(0, random(25, 100), 0, 255);
    }
    line(-x, 0, -x * 0.1, 0);
    // mid-tone
    stroke(col * 0.75, 255);
    if (random() < 0.1) {
      stroke(0, random(25, 100), 0, 255);
    }
    line(-x * 0.1, 0, x * 0.32, 0);
    // shadow
    stroke(col * 0.5, 255);
    if (random() < 0.2) {
      stroke(0, random(25, 100), 0, 255);
    }
    line(x * 0.32, 0, x, 0);
    // Inside the loop, there is a conditional block that has a small chance of creating a sub-branch. This sub-branch is drawn similarly to the main branch but with a smaller length. This creates the branching structure of the tree.
    if (random() < 0.005) {
      push();
      translate(0, 0);
      let theta = random(-PI * 0.14, PI * 0.14);
      rotate(theta);
      let swB = sw;
      strokeWeight(2);
      
      

      for (let yB = 0; yB < len * 1.05; yB++) {
        let xB = map(yB, 0, len, swB, swB * 0.8);
        let col = map(xB, 12, 3, 255, 75);
        colKeep = col;
        push();
        translate(random(-xB * 0.12, xB * 0.12), -yB);

        // highlight
        stroke(col, 255);
        if (random() < 0.05) {
          stroke(0, random(25, 100), 0, 255);
        }
        line(-xB, 0, -xB * 0.1, 0);
        // mid-tone
        stroke(col * 0.75, 255);
        if (random() < 0.1) {
          stroke(0, random(25, 100), 0, 255);
        }
        line(-xB * 0.1, 0, xB * 0.32, 0);
        // shadow
        stroke(col * 0.5, 255);
        if (random() < 0.2) {
          stroke(0, random(25, 100), 0, 255);
        }
        line(xB * 0.32, 0, xB, 0);

        pop();
      }
      // translates the drawing context upward by the length of the branch to prepare for the next iteration

      translate(0, -len);
      if (len > tminLen) {
        // recursive method
        treeMaker(len * 0.8);
      }
      pop();
    }

    pop();
    
  // Conditional block that adds even smaller branches at certain points along the main branch using stickMaker()
// Additional conditions to ensure trees are not facing down    
    if (random() < 0.005 && len < tmaxLen * 0.8) {
      for (let sn = 0; sn < 4; sn++) {
        push();
          // Use the random() function to generate a random angle between 0 and 2 PI (TAU).
        rotate(random(TAU));
        stickMaker(smaxLen);
        pop();
      }
    }
  }

  // translating the drawing context upward again and recursively calling itself with a reduced length 
  translate(0, -len);
  if (len > tminLen) {
    treeMaker(len * 0.8);
  }
  
  // one more conditional block that adds even smaller branches at certain points along the main branch using stickMaker()
  if (random() < 0.02 && len < tmaxLen * 0.4) {
    for (let sn = 0; sn < 4; sn++) {
      push();
      translate(0, 0);
      rotate(random(TAU));
      stickMaker(smaxLen);
      pop();
    }
  }
  pop();
}

function stickMaker(len) {
  push();
  rotate(random(TAU));
  leafMaker(len);
  pop();
  push();
  translate(0, 0);
  let theta = random(-PI * 0.3, PI * 0.3);
  rotate(theta);
  let sw = map(len, sminLen, smaxLen, 1, 4);
  strokeWeight(sw);
  stroke(100, 255);
  line(0, 0, 0, -len);
  stroke(25, 255);
  line(sw * 0.75, sw * 0.75, sw * 0.75, sw * 0.75 - len);
  translate(0, -len);
  if (len > sminLen) {
    // recursive method
    stickMaker(len * 0.7);
  }
  pop();
}

function leafMaker(len) {
  let leafDense = floor(random(1, 4));
  for (let n = 0; n < leafDense; n++) {
    
    // set coordinates, color, size of the leaf using vector
    let z = createVector(random(0.5, 1), random(0.25, 0.5));
    let pos = createVector(random(-1, 1), random(-1, 1));
    let m = random(len);
    pos.mult(m);
    let col = map(pos.y, -m, m, 255, 25);    
    z.mult(sminLen * 1.5);
    push();
    translate(pos.x, pos.y);
    
    // draw circumference of leaf (1)
    beginShape();
    vertex(0, 0);
    bezierVertex(z.x, z.y, z.x, -z.y, -z.x, -z.y);
    fill(255 - colKeep, col, colKeep, 225);
    stroke(0, col * 1.1, colKeep, 255);
    strokeWeight(1);
    endShape();
    
    // draw circumference of leaf (2)
    beginShape();
    vertex(0, 0);
    bezierVertex(z.x, z.y, -z.x, z.y, -z.x, -z.y);
    fill(255 - colKeep, col * 0.7, colKeep * 0.7, 225);
    stroke(0, col * 1.1, colKeep, 255);
    strokeWeight(1);
    endShape();
    
    
    // draw line in the center of the leaf
    strokeWeight(1);
    line(-z.x, -z.y, z.x * 0.25, z.y * 0.25);
    pop();
  }
}
