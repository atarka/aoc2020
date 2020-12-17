const fs = require('fs');
const data = fs.readFileSync('input17.txt', { encoding: 'utf8' });

const world = {}, anotherWorld = {}, dimensions = 4, cycles = 6;
let w = world, aw = anotherWorld; // shout out to chahi
const fill = (withWhat, what = []) => what.concat(Array(dimensions - what.length).fill(withWhat));
const boundaries = fill([0, 0]);

const put = (world, coords, v) => {
  for (let dimension = 0; dimension < dimensions; ++dimension) {
    if (dimension === dimensions - 1) {
      world[coords[dimension]] = v;
    } else {
      if (!world[coords[dimension]]) world[coords[dimension]] = {};
      world = world[coords[dimension]]
    }

    if (v) {
      boundaries[dimension][0] = Math.min(coords[dimension], boundaries[dimension][0]);
      boundaries[dimension][1] = Math.max(coords[dimension], boundaries[dimension][1]);
    }
  }
}

const get = (world, coords, delta = []) =>
  coords.reduce((w, coord, i) => !w || !w[coord + (delta[i] || 0)] ? false : w[coord + (delta[i] || 0)], world);

data.split(/\r?\n/g)
  .forEach((row, y) =>
    row.split('').forEach((cell, x) =>
        cell === '#' && put(world, fill(0, [x, y]), 1)));

// main recursor that recurses whatever the fuck! =)
const rec = (dimension, coord, callback, boundaries) => {
  if (dimension === dimensions) {
    callback(coord);
  } else for (let i = boundaries[dimension][0] - 1, l = boundaries[dimension][1] + 1; i <= l; ++i) {
    coord[dimension] = i;
    rec(dimension + 1, coord, callback, boundaries);
  }
}

const sumMatrix = []; // that's the multidimensional matrix of neighbour deltas
rec(0, [], coord => coord.some(n => n) && sumMatrix.push(coord.concat()), fill([0, 0]));

for (let cycle = 0; cycle < cycles; ++cycle) {
  rec(0, [], (coord) => {
    const neighbours = sumMatrix.reduce((acc, delta) => acc + get(w, coord, delta), 0);
    if (get(w, coord)) {
      put(aw, coord, neighbours === 2 || neighbours === 3 ? 1 : 0);
    } else {
      put(aw, coord, neighbours === 3 ? 1 : 0);
    }
  }, boundaries);

  [w, aw] = [aw, w];
}

let cubes = 0;
rec(0, [], coord => cubes += get(w, coord), boundaries);

console.log(cubes);