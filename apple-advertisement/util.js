function generateRandomPos(x, y, mag) {
  var pos = new p5.Vector(x, y);
  var randomDirection = new p5.Vector(random(width), random(height));
  var vel = p5.Vector.sub(randomDirection, pos);
  vel.normalize();
  vel.mult(mag);
  pos.add(vel);
  return pos;
}

function nextImage() {
  imgIndex++;
  if (imgIndex > imgs.length - 1) {
    imgIndex = 0;
  }
  imgs[imgIndex].loadPixels();
  var particleIndexes = [];
  for (var i = 0; i < allParticles.length; i++) {
    particleIndexes.push(i);
  }

  var pixelIndex = 0;

  for (var y = 0; y < imgs[imgIndex].height; y++) {
    for (var x = 0; x < imgs[imgIndex].width; x++) {
      var pixelR = imgs[imgIndex].pixels[pixelIndex];
      var pixelG = imgs[imgIndex].pixels[pixelIndex + 1];
      var pixelB = imgs[imgIndex].pixels[pixelIndex + 2];
      var pixelA = imgs[imgIndex].pixels[pixelIndex + 3];
      pixelIndex += 4;
      if (random(1.0) > 10) {
        continue;
      }
      var pixelColor = color(pixelR, pixelG, pixelB);
      if (particleIndexes.length > 0) {
        var index = particleIndexes.splice(
          random(particleIndexes.length - 1),
          1
        );
        var newParticle = allParticles[index];
      } else {
        var newParticle = new Particle(width / 2, height / 2);
        allParticles.push(newParticle);
      }

      newParticle.target.x = x + width / 2 - imgs[imgIndex].width / 2;
      newParticle.target.y = y + height / 2 - imgs[imgIndex].height / 2;
      newParticle.endColor = pixelColor;
    }
  }

  if (particleIndexes.length > 0) {
    for (var i = 0; i < particleIndexes.length; i++) {
      allParticles[particleIndexes[i]].kill();
    }
  }
}
