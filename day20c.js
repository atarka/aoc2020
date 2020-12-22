const fs = require('fs');
const data = fs.readFileSync('input20.txt', { encoding: 'utf8' });

data.split(/\r?\n\r?\n/);
const num = ({ pixels, sx = 0, sy = 0, x = 0, y = 0}) => {
  let num = 0;
  for (let i = 0; i < 10; ++i, x += sx, y += sy) num += pixels[y][x] * (1 << (9 - i));
  return num;
}

const attaches = {
  left: {},
  top: {},
}

const rotate = (what) => {
  const newMatrix = [];
  for (let y = 0; y < what.length; ++y) newMatrix[y] = [];
  for (let y = 0; y < what.length; ++y) {
    const row = what[y];
    for (let x = 0; x < row.length; ++x) {
      newMatrix[what.length - 1 - x][y] = what[y][x];
    }
  }

  return newMatrix;
}

const flip = (what) => {
  const newMatrix = [];
  for (let y = 0; y < what.length; ++y) newMatrix[y] = [];

  for (let y = 0; y < what.length; ++y) {
    const row = what[y];
    for (let x = 0; x < row.length; ++x) {
      newMatrix[y][what.length - 1 - x] = what[y][x];
    }
  }

  return newMatrix;
}

const tiles = [];
const variants = [];
const borderNumbers = {};
const putty = (tile, type, value) => {
  if (!borderNumbers[value]) borderNumbers[value] = [];
  borderNumbers[value].push({ tile, type, variant: variants.length });
}
const intersect = (a, b) => a.filter(value => b.includes(value))
const diff = (a, b) => a.filter(value => !b.includes(value));

[...data.matchAll(/Tile (\d+):\r?\n(.+?)(\r?\n\r?\n|$)/gs)].map(m => {
  const tile = +m[1];
  let pixels = m[2].split(/\r?\n/).map(line => line.split('').map(pixel => 1 * (pixel === '#')));

  tiles.push(tile);
  for (let i = 0; i < 8; ++i) {
    if (i === 4) pixels = flip(pixels);
    const top = num({pixels, sx: 1});
    const bottom = num({pixels, sx: 1, y: 9});
    const left = num({pixels, sy: 1});
    const right = num({pixels, sy: 1, x: 9});

    putty(tile, 'left', left);
    putty(tile, 'top', top);
    putty(tile, 'right', right);
    putty(tile, 'bottom', bottom);
    variants.push({ tile, pixels, borders: [left, right, top, bottom], left, right, top, bottom });
    pixels = rotate(pixels);
  }
});

const soloBorders = Object.keys(borderNumbers).filter(key => borderNumbers[key].length === 4).map(n => +n);
const corners = variants.filter(variant => intersect(variant.borders, soloBorders).length === 2);
const width = Math.sqrt(tiles.length);
const orderedTiles = [];

const leftRightCorners = corners.filter(corner => soloBorders.includes(corner.left) && soloBorders.includes(corner.top));

for (corner of leftRightCorners) {
  for (y = 0; y < width; ++y) {
    orderedTiles[y] = [];
    for (x = 0; x < width; ++x) {
      orderedTiles[y][x] = 0;
    }
  }

  orderedTiles[0][0] = {...corner};
  const usedVariants = [];
  const usedTiles = [corner.tile];

  outer:
    for (y = 0; y < width; ++y) {
      for (x = y ? 0 : 1; x < width; ++x) {
        if (x) {
          const link = orderedTiles[y][x - 1];
          const possibleTiles = borderNumbers[link.right].filter(variant => variant.type === 'left' && !usedTiles.includes(variant.tile));
          if (possibleTiles.length > 1) break outer;
          else if (possibleTiles.length < 1) break outer;

          const tile = possibleTiles[0];
          orderedTiles[y][x] = {...variants[tile.variant]};
          usedTiles.push(tile.tile);

        } else {
          const link = orderedTiles[y - 1][x];
          const possibleTiles = borderNumbers[link.bottom].filter(variant => variant.type === 'top' && !usedTiles.includes(variant.tile));

          if (possibleTiles.length > 1) break outer;
          else if (possibleTiles.length < 1) break outer;

          const tile = possibleTiles[0];
          orderedTiles[y][x] = {...variants[tile.variant]};
          usedTiles.push(tile.tile);
        }
      }
    }

    if (x === width && y === width) break;
}

let matrix = [];
const cellSize = 8;
for (let ty = 0; ty < width * cellSize; ++ty) {
  matrix[ty] = [];
  for (let tx = 0; tx < width * cellSize; ++tx) {
    matrix[ty][tx] = 0;
  }
}

for (let ty = 0; ty < width; ++ty) {
  for (let tx = 0; tx < width; ++tx) {
    const pixels = orderedTiles[ty][tx].pixels;
    for (let y = 0; y < cellSize; ++y) {
      for (let x = 0; x < cellSize; ++x) {
        matrix[ty * cellSize + y][tx * cellSize + x] = pixels[y + 1][x + 1];
      }
    }
  }
}

const dragon = [[18, 0], [0, 1], [5, 1], [6, 1], [11, 1], [12, 1], [17, 1], [18, 1], [19, 1], [1, 2], [4, 2], [7, 2], [10, 2], [13, 2], [16, 2]];
const dragonWidth = 20;
const dragonHeight = 3;
let totalDragons = 0;
matrix = rotate(matrix);

for (let i = 0; i < 8; ++i) {
  if (i === 4) matrix = flip(matrix);
  totalDragons = 0;

  for (let y = 0; y < width * cellSize - dragonHeight; ++y) {
    for (let x = 0; x < width * cellSize - dragonWidth; ++x) {
      let dragonPresent = true;
      for (dragonBall of dragon) {
        if (!matrix[y + dragonBall[1]][x + dragonBall[0]]) {
          dragonPresent = false;
          break;
        }
      }

      if (dragonPresent) {
        ++totalDragons;
        for (dragonBall of dragon) matrix[y + dragonBall[1]][x + dragonBall[0]] = 2;
      }
    }
  }

  if (totalDragons) break;
  matrix = rotate(matrix);
}

const totalNonDragons = matrix.reduce((acc, row) => acc + row.reduce((acc, pixel) => acc + (pixel === 1 ? 1 : 0), 0), 0);
console.log(`NON DRAGONS: ${totalNonDragons}`);
