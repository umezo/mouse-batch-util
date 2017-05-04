//@flow
/*::
  import type { Matrix } from 'opencv';
  import type { Bitmap } from 'robotjs';
*/
const cv = require('opencv');
const robot = require('robotjs');

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

function detect(template/*:Matrix*/, target/*:Marix*/, threshold = 0.8)/*: number[] */ {
  const res = target.matchTemplateByMatrix(template, 5);
  const { maxVal, maxLoc } = res.minMaxLoc();

  if (maxVal < threshold) {
    return null;
  }

  return maxLoc
}

function detectCenter(template/*:Matrix*/, target/*:Marix*/, threshold = 0.8)/*: number[] */ {
  const maxLoc = detect(template, target, threshold);
  if (!maxLoc) { return null; }

  return {
    x: maxLoc.x + template.width() / 2,
    y: maxLoc.y + template.height() / 2
  };
}

function clickTemplate(templateMatrix/*:Matrix*/) {

}

function bmp2matrix(bmp/*:Bitmap*/)/*:Matrix*/{
  const matrix = new cv.Matrix(bmp.height, bmp.width, cv.Constants.CV_8UC4);

  matrix.put(bmp.image);

  return matrix;
}

function screenShot(x, y, w, h)/*:Bitmap*/{
  return robot.screen.capture(x, y, w, h);
}

module.exports = {
  loadImage,
  detect,
  detectCenter,
  bmp2matrix,
  screenShot
};
