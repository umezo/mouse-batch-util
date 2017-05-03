//@flow
/*::
  import type { Matrix } from 'opencv';
*/
const cv = require('opencv');

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

module.exports = {
  loadImage
};
