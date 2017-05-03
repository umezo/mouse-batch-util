import test from 'ava';
const {loadImage}= require('..');
const path = require('path');

test('test', async (t) => {
  const matrix = await loadImage( path.join(__dirname, 'fixture/user.jpg') )
  t.deepEqual(matrix.width(), 180);
  t.deepEqual(matrix.height(), 168);
});
