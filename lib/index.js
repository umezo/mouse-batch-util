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

function _bmp2matrix(bmp/*:Bitmap*/)/*:Matrix*/{
  const matrix = new cv.Matrix(bmp.height, bmp.width, cv.Constants.CV_8UC4);

  matrix.put(bmp.image);

  return matrix;
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

function detectCenterOnScreen(template/*:Matrix*/, threshold/*:number*/ = 0.8)/*: {x:number, y:number}|null */ {
  const screenMatrix = screenShot();
  const maxLoc = detectCenter(template, screenMatrix, threshold);
  if (!maxLoc) { return null; }

  return {
    x: maxLoc.x / POSITION_MODIFIER,
    y: maxLoc.y / POSITION_MODIFIER
  };
}

function screenShot(x/*:?number*/, y/*:?number*/, w/*:?number*/, h/*:?number*/)/*:Matrix*/{
  return _bmp2matrix( robot.screen.capture(x, y, w, h) );
}

function clickTemplate(templateMatrix/*:Matrix*/, holdDurationMS/*:number*/ = 100)/*:Promise<boolean>*/ {
  const screenMatrix = screenShot();

  const point = detectCenterOnScreen(templateMatrix, screenMatrix);

  if (!point) {
    return new Promise(function(resolve){
      resolve(false);
    });
  }

  return click(point.x, point.y).then(function(){return true;});
}

function click (x/*:number*/, y/*:number*/, holdDurationMS/*:number*/ = 100)/*:Promise<void>*/{
  return new Promise(function(resolve){
    move(x, y);
    down();
    resolve();
  })
  .then(function(){
    return sleep(holdDurationMS);
  })
  .then(function(){
    up();
  });
}

function move (x/*:number*/, y/*:number*/)/*:void*/{
  robot.moveMouse(x, y);
}

function down (x/*:?number*/, y/*:?number*/)/*:void*/{
  if (x != undefined) {
    move(x, y);
  }
  robot.mouseToggle('down', 'left');
}

function up ()/*:void*/{
  robot.mouseToggle('up', 'left');
}

function drag (toX/*:number*/, toY/*:number*/, fromX/*:?number*/, fromY/*:?number*/)/*:void*/{
  if (x != undefined) {
    down(x, y);
  }
  robot.dragMouse(toX, toY);
}

module.exports = {
  loadImage,
  detect,
  detectCenter,
  detectCenterOnScreen,
  screenShot,
  clickTemplate,
  sleep,
  click,
  move,
  down,
  up,
  drag
};
