/* eslint-disable*/

const { promises: fs } = require('fs');
const path = require('path');
const icons = require('svg-app-icon');

async function generatePng(svg) {
  await icons(svg, {
    destination: path.join(__dirname, 'png'),
    icns: false,
    ico: false,
    svg: false,
    pngSizes: [16, 24, 32, 48, 64, 128, 256, 512],
  });
}

async function generateIcons(svg) {
  await generatePng(svg);

  await icons(svg, {
    destination: __dirname,
    png: false,
  });
}

fs.readFile(path.join(__dirname, 'icon.svg')).then((svg) => {
  generateIcons(svg);
});
