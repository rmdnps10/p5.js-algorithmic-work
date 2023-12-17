// path 모듈 불러오기
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./sketch.js",
  output: {
    // 최종 번들링된 자바스크립트
    filename: "main.js",
    // dist를 배포용 폴더로 사용
    path: path.resolve(__dirname, "dist"),
  },
};
