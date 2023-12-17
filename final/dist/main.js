/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./particle.js":
/*!*********************!*\
  !*** ./particle.js ***!
  \*********************/
/***/ (() => {

eval("function Particle(x, y) {\n  this.pos = new p5.Vector(x, y);\n  this.vel = new p5.Vector(0, 0);\n  this.acc = new p5.Vector(0, 0);\n  this.target = new p5.Vector(0, 0);\n  this.isKilled = false;\n  this.maxSpeed = random(0.25, 2);\n  this.maxForce = random(8, 15);\n  this.currentColor = color(0);\n  this.endColor = color(0);\n  this.colorBlendRate = random(0.01, 0.05);\n  this.currentSize = 0;\n  this.distToTarget = 0;\n  this.move = function () {\n    this.distToTarget = dist(\n      this.pos.x,\n      this.pos.y,\n      this.target.x,\n      this.target.y\n    );\n\n    if (this.distToTarget < closeEnoughTarget) {\n      var proximityMult = this.distToTarget / closeEnoughTarget;\n      this.vel.mult(0.9);\n    } else {\n      var proximityMult = 1;\n      this.vel.mult(0.95);\n    }\n\n    if (this.distToTarget > 1) {\n      var steer = new p5.Vector(this.target.x, this.target.y);\n      steer.sub(this.pos);\n      steer.normalize();\n      steer.mult(this.maxSpeed * proximityMult * 0.5);\n      // 0.5를 조절할수있다.\n      this.acc.add(steer);\n    }\n\n    var mouseDist = dist(this.pos.x, this.pos.y, mouseX + 30, mouseY);\n    // 여기 조절\n    if (mouseDist < 100) {\n      if (mouseIsPressed) {\n        var push = new p5.Vector(mouseX, mouseY);\n        push.sub(new p5.Vector(this.pos.x, this.pos.y));\n      } else {\n        var push = new p5.Vector(this.pos.x, this.pos.y);\n        push.sub(new p5.Vector(mouseX, mouseY));\n      }\n      push.normalize();\n      // 여기 조절\n      push.mult((100 - mouseDist) * 0.05);\n      this.acc.add(push);\n    }\n    this.vel.add(this.acc);\n    this.vel.limit(this.maxForce * 0.3);\n    this.pos.add(this.vel);\n    this.acc.mult(0);\n  };\n\n  this.draw = function () {\n    this.currentColor = lerpColor(\n      this.currentColor,\n      this.endColor,\n      this.colorBlendRate\n    );\n    stroke(this.currentColor);\n    if (!this.isKilled) {\n      // 파티클 사이즈 조정\n      var targetSize = map(\n        min(this.distToTarget, closeEnoughTarget),\n        closeEnoughTarget,\n        0,\n        0,\n        10\n      );\n    } else {\n      var targetSize = 2;\n    }\n    this.currentSize = lerp(this.currentSize, targetSize, 0.1);\n    strokeWeight(this.currentSize);\n    point(this.pos.x, this.pos.y);\n  };\n\n  this.kill = function () {\n    if (!this.isKilled) {\n      this.target = generateRandomPos(\n        width / 2,\n        height / 2,\n        max(width, height)\n      );\n      this.endColor = color(0);\n      this.isKilled = true;\n    }\n  };\n\n  this.isOutOfBounds = function () {\n    return (\n      this.pos.x < 0 ||\n      this.pos.x > width ||\n      this.pos.y < 0 ||\n      this.pos.y > height\n    );\n  };\n}\n\n\n//# sourceURL=webpack://final/./particle.js?");

/***/ }),

/***/ "./sketch.js":
/*!*******************!*\
  !*** ./sketch.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _particle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./particle.js */ \"./particle.js\");\n/* harmony import */ var _particle_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_particle_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ \"./util.js\");\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_util_js__WEBPACK_IMPORTED_MODULE_1__);\n// 20201148 정인영\n// Advertising about Apple branding\n\n\nlet poseNet;\nlet poses = [];\nlet handIsUp = false; // Variable to track hand position\nvar imgs = [];\nvar imgNames = [\n  \"assets/logo/2001.png\",\n  \"assets/logo/2002.png\",\n  \"assets/logo/2003.png\",\n  \"assets/logo/2004.png\",\n  \"assets/logo/2005.png\",\n  \"assets/logo/2006.png\",\n  \"assets/logo/2011.png\",\n  \"assets/logo/2012.png\",\n  \"assets/logo/2014.png\",\n  \"assets/logo/2017.jpeg\",\n  \"assets/logo/2019.jpeg\",\n  \"assets/logo/2020.png\",\n  \"assets/logo/2021.png\",\n  \"assets/logo/2022.jpg\",\n];\n\nvar imgIndex = -1;\nvar loadPercentage = 0.045;\nvar closeEnoughTarget = 50;\nvar allParticles = [];\nvar mouseSizeSlider;\nvar particleSizeSlider;\nvar speedSlider;\nvar resSlider;\nvar nextImageButton;\n\nfunction preload() {\n  // Pre-load all images.\n  for (var i = 0; i < imgNames.length; i++) {\n    var newImg = loadImage(imgNames[i]);\n    imgs.push(newImg);\n  }\n  sfFontRegular = loadFont(\n    \"https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff\"\n  );\n  sfFontMedium = loadFont(\"assets/font/SFPRODISPLAYMEDIUM.OTF\");\n}\n\nfunction setup() {\n  createCanvas(windowWidth, windowHeight);\n  nextImage();\n}\n\nfunction draw() {\n  background(0);\n\n  for (var i = allParticles.length - 1; i > -1; i--) {\n    allParticles[i].move();\n    allParticles[i].draw();\n\n    if (allParticles[i].isKilled) {\n      if (allParticles[i].isOutOfBounds()) {\n        allParticles.splice(i, 1);\n      }\n    }\n  }\n\n  fill(\"#dee2e6\");\n  textAlign(CENTER);\n  noStroke();\n  textSize(30);\n  textFont(sfFontMedium);\n  text(\"2001\", windowWidth / 2, (windowHeight / 8) * 7);\n  textSize(20);\n  textFont(sfFontRegular);\n  text(\"2001\", windowWidth / 2, (windowHeight / 12) * 11);\n}\n\nfunction keyPressed() {\n  nextImage();\n}\n\n\n//# sourceURL=webpack://final/./sketch.js?");

/***/ }),

/***/ "./util.js":
/*!*****************!*\
  !*** ./util.js ***!
  \*****************/
/***/ (() => {

eval("function generateRandomPos(x, y, mag) {\n  var pos = new p5.Vector(x, y);\n  var randomDirection = new p5.Vector(random(width), random(height));\n  var vel = p5.Vector.sub(randomDirection, pos);\n  vel.normalize();\n  vel.mult(mag);\n  pos.add(vel);\n  return pos;\n}\n\nfunction nextImage() {\n  imgIndex++;\n  if (imgIndex > imgs.length - 1) {\n    imgIndex = 0;\n  }\n  imgs[imgIndex].loadPixels();\n  var particleIndexes = [];\n  for (var i = 0; i < allParticles.length; i++) {\n    particleIndexes.push(i);\n  }\n\n  var pixelIndex = 0;\n\n  for (var y = 0; y < imgs[imgIndex].height; y++) {\n    for (var x = 0; x < imgs[imgIndex].width; x++) {\n      var pixelR = imgs[imgIndex].pixels[pixelIndex];\n      var pixelG = imgs[imgIndex].pixels[pixelIndex + 1];\n      var pixelB = imgs[imgIndex].pixels[pixelIndex + 2];\n      var pixelA = imgs[imgIndex].pixels[pixelIndex + 3];\n      pixelIndex += 4;\n      //slider\n      if (random(1.0) > 0.04) {\n        continue;\n      }\n      var pixelColor = color(pixelR, pixelG, pixelB);\n      if (particleIndexes.length > 0) {\n        var index = particleIndexes.splice(\n          random(particleIndexes.length - 1),\n          1\n        );\n        var newParticle = allParticles[index];\n      } else {\n        var newParticle = new Particle(width / 2, height / 2);\n        allParticles.push(newParticle);\n      }\n\n      newParticle.target.x = x + width / 2 - imgs[imgIndex].width / 2;\n      newParticle.target.y = y + height / 2 - imgs[imgIndex].height / 2;\n      newParticle.endColor = pixelColor;\n    }\n  }\n\n  if (particleIndexes.length > 0) {\n    for (var i = 0; i < particleIndexes.length; i++) {\n      allParticles[particleIndexes[i]].kill();\n    }\n  }\n}\n\n\n//# sourceURL=webpack://final/./util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./sketch.js");
/******/ 	
/******/ })()
;