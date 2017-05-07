//@flow
import robot from 'robotjs';
import test from 'ava';
const {
  loadImage,
  detect,
  detectCenter,
  screenShot,
  clickTemplate
}= require('..');
const path = require('path');

test('loadImage', async (t) => {
  const matrix = await loadImage( path.join(__dirname, 'fixture/template.png') );
  t.deepEqual(matrix.width(), 388);
  t.deepEqual(matrix.height(), 365);
});

test('detect', async (t) => {
  const template = await loadImage( path.join(__dirname, 'fixture/template.png') );
  const screen = await loadImage( path.join(__dirname, 'fixture/screen.png') );
  const result = detect(template, screen);

  t.deepEqual(result, {
    x: 2353,
    y: 715 
  });
});

test('detectCenter', async (t) => {
  const template = await loadImage( path.join(__dirname, 'fixture/template.png') );
  const screen = await loadImage( path.join(__dirname, 'fixture/screen.png') );
  const result = detectCenter(template, screen);

  t.deepEqual(result, {
    x: 2353 + 388/2,
    y: 715 + 365/2
  });
});

test('clickTemplate', async (t) => {
  const ssMatrix = screenShot(230, 230, 200, 200);

  const result = await clickTemplate(ssMatrix);
  t.true(result);

  const mousePoint = robot.getMousePos();

  t.deepEqual(mousePoint, { x: 230 + 200 / 2, y: 230 + 200 / 2 });
});
