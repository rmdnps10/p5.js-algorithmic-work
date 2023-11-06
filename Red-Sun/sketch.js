// 20201148 정인영 
// Creative Algorithm Project #5: Visuzlize X
// Project Title: Red sun 
// 행주의 'Red sun' 이라는 노래의 음형적 데이터 (spectrum, frequency) 를 시각화하였습니다.


let fft;
let audio;
let canvas;

let isPressed = false;
var particles = [];

function preload() {
    audio = loadSound('redsun.mp3');
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 255);
    fft = new p5.FFT();
}

function draw() {
    blendMode(BLEND)
    background(0);
    noStroke();
    // Target Data
    let spectrum = fft.analyze();
    amp= fft.getEnergy(20,100);
  
    blendMode(ADD)
    for (let i = 0; i < spectrum.length * 2; i+=10) {
        let hue = map(i, 0, spectrum.length, 0, 255);
        let diameter = map(spectrum[i], 0, 255, 0, height * 0.75);

        fill(hue, 255, 15);

        let x = map(i, 0, spectrum.length, width / 2, width);
        ellipse(x, height / 2, diameter, diameter);

        x = map(i, 0, spectrum.length, width / 2, 0);
        ellipse(x, height / 2, diameter, diameter);
    }

    for (let i = 0; i < spectrum.length * 3; i+=30) {
        let hue = map(i, 0, spectrum.length, 0, 255);
        let diameter = map(spectrum[i], 0, 255, 0, height * 0.75);

        fill(hue, 255, 30);

        let x = map(i, 0, spectrum.length, width / 6, width / 3);
        ellipse(x, height / 2, diameter / 2, diameter / 2);

        x = map(i, 0, spectrum.length, width / 6, 0);
        ellipse(x, height / 2, diameter / 2, diameter / 2);
    }

    for (let i = 0; i < spectrum.length * 3; i+=30) {
        let hue = map(i, 0, spectrum.length, 0, 255);
        let diameter = map(spectrum[i], 0, 255, 0, height * 0.75);

        fill(hue, 255, 30);

        let x = map(i, 0, spectrum.length, width * 5 / 6, width * 2 / 3);
        ellipse(x, height / 2, diameter / 2, diameter / 2);

        x = map(i, 0, spectrum.length, width * 5 / 6, width);
        ellipse(x, height / 2, diameter / 2, diameter / 2);
    }
  
  
    var p = new Particle()
    particles.push(p)
    translate(width/2, height/2)
    for (var j =particles.length-1; j>=0;j--){
      if (!particles[j].edges()){
        particles[j].update (amp>230)
      
      particles[j].show()
    }
    else{
      particles.splice(j,1) 
    }
    
  }
  
  
}


function mousePressed() {
    if (isPressed) {
      audio.pause()
      isPressed = false
    }
    else {
      isPressed = true
      audio.loop()
    }
  }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


class Particle{
  constructor(){
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0,0)
    this.acc= this.pos.copy().mult(random(0.0001,0.00001))
    
    this.w = random(3,20);
    
    this.color= [random(200,255), random(200,255), random(200,255)]
  }
  update(cond){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges(){
    if (this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2){
      return true
    } else{
      return false
    }
  }
  show(){
    noStroke();
    if (amp > 220){
      fill(255,255,255);
    }
    ellipse(this.pos.x -random(10,30), this.pos.y-random(10,30),this.w)
    ellipse(this.pos.x -random(10,30), this.pos.y+random(10,30),this.w)
    ellipse(this.pos.x +random(10,30), this.pos.y-random(10,30),this.w)
    ellipse(this.pos.x+random(10,30), this.pos.y+random(10,30),this.w)
    ellipse(this.pos.x, this.pos.y,this.w)
    
  }
}