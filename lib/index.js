//@flow
/*::
  import type { Matrix } from 'opencv';
  import type { Bitmap } from 'robotjs';
*/
const cv = require('opencv');
const robot = require('robotjs');

function sleep(ms/*:number*/)/*:Promise<void>*/ {
  return new Promise(function(resolve){
    setTimeout(resolve, ms);
  });
}

// because retina resolution is double, some position about desktop screen should be divided by this modifier
const POSITION_MODIFIER/*:number*/ = parseInt(process.env.POSITION_MODIFIER || 1, 10);

function loadImage(path/*:string*/) /*:Promise<Matrix>*/ {
  return new Promise(function(resolve, reject){
    cv.readImage(path, function(err, target/*:Matrix*/) {
      if (err) {
        reject();
        return;
      }

      resolve(target);
    });
  });
}

function detect(template/*:Matrix*/, target/*:Matrix*/, threshold/*:number*/ = 0.8)/*: {x:number, y:number}|null */ {
  const res = target.matchTemplateByMatrix(template, 5);
  const { maxVal, maxLoc } = res.minMaxLoc();

  if (maxVal < threshold) {
    return null;
  }

  return maxLoc
}

function detectCenter(template/*:Matrix*/, target/*:Matrix*/, threshold/*:number*/ = 0.8)/*: {x:number, y:number}|null */ {
  const maxLoc = detect(template, target, threshold);
  if (!maxLoc) { return null; }

  return {
    x: maxLoc.x + template.width() / 2,
    y: maxLoc.y + template.height() / 2
  };
}

function clickTemplate(templateMatrix/*:Matrix*/)/*:Promise<boolean>*/ {
  return slowClickTemplate(templateMatrix);
}

function slowClickTemplate(templateMatrix/*:Matrix*/, holdDurationMS/*:number*/ = 100)/*:Promise<boolean>*/ {
  const screenBMP = screenShot();
  const screenMatrix = bmp2matrix(screenBMP);

  const point = detectCenter(templateMatrix, screenMatrix);

  if (!point) {
    return new Promise(function(resolve){
      resolve(false);
    });
  }

  return new Promise(function(resolve){
    robot.moveMouse(point.x / POSITION_MODIFIER, point.y / POSITION_MODIFIER);
    robot.mouseToggle('down', 'left');
    resolve();
  })
  .then(sleep(holdDurationMS))
  .then(function(){
    robot.mouseToggle('up', 'left');

    return true;
  });
}

function bmp2matrix(bmp/*:Bitmap*/)/*:Matrix*/{
  const matrix = new cv.Matrix(bmp.height, bmp.width, cv.Constants.CV_8UC4);

  matrix.put(bmp.image);

  return matrix;
}

function screenShot(x/*:?number*/, y/*:?number*/, w/*:?number*/, h/*:?number*/)/*:Bitmap*/{
  return robot.screen.capture(x, y, w, h);
}

module.exports = {
  loadImage,
  detect,
  detectCenter,
  bmp2matrix,
  screenShot,
  clickTemplate,
  slowClickTemplate
};
