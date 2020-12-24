const fs = require('fs');
const data = fs.readFileSync('input24.txt', { encoding: 'utf8' });

const tiles = {};
const length = 10000;
const steps = { nw: 330, ne: 30, se: 150, sw: 210, e: 90, w: 270 };

const walkPath = path => {
  const pos = { x: 0, y: 0 };
  [...path.matchAll(/(nw|sw|ne|se|e|w)/g)].forEach(step => {
    const dir = step[1];
    pos.x += Math.round(Math.sin(steps[dir] / 180 * Math.PI) * length);
    pos.y -= Math.round(Math.cos(steps[dir] / 180 * Math.PI) * length);
  })

  const key = `${pos.x}x${pos.y}`;
  const tile = tiles[key] || 'w';
  tiles[key] = tile === 'w' ? 'b' : 'w';
}

const liveADay = (tiles) => {
  const newTiles = {};
  const tileKeys = Object.keys(tiles);

  while (tileKeys.length) {
    const key = tileKeys.shift();
    const [x, y] = key.split('x');

    let blacks = 0;
    let color = tiles[key];

    for (let a = 30; a < 333; a += 60) {
      const neighbor = {
        x: x * 1 + Math.round(Math.sin(a / 180 * Math.PI) * length),
        y: y * 1 - Math.round(Math.cos(a / 180 * Math.PI) * length),
      }
      const neighborKey = `${neighbor.x}x${neighbor.y}`
      if (tiles[neighborKey] === 'b') ++blacks;
      else if (color === 'b' && typeof tiles[neighborKey] === 'undefined') tileKeys.push(neighborKey);
    }

    if (color === 'b') {
      if (blacks === 0 || blacks > 2) color = 'w';
    } else {
      if (blacks === 2) color = 'b';
    }

    newTiles[key] = color;
  }

  return newTiles;
}

const tilePaths = data.split(/\r?\n/).forEach(path => walkPath(path));
console.log(`Blacks: ${Object.keys(tiles).filter(key => tiles[key] === 'b').length}`);

let newTiles;
for (let i = 0; i < 100; ++i) {
  newTiles = liveADay(newTiles || tiles);
}
console.log(Object.keys(newTiles).filter(key => newTiles[key] === 'b').length);
