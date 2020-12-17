const fs = require('fs');
const data = fs.readFileSync('input17.txt', { encoding: 'utf8' });

const world = {}, anotherWorld = {}, dimensions = 4, cycles = 6;
const boundaries = [].concat(Array(dimensions).fill([0, 0]));
let w = world, aw = anotherWorld; // shout out to chahi

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
        cell === '#' && put(world, [x, y].concat(Array(dimensions - 2).fill(0)), 1)));

// main recursor that recurses whatever the fuck! =)
const rec = (dimension, coord, callback, from, to) => {
  if (dimension === dimensions) {
    callback(coord);
  } else for (let i = from(dimension), l = to(dimension); i <= l; ++i) {
    coord[dimension] = i;
    rec(dimension + 1, coord, callback, from, to);
  }
}

const sumMatrix = []; // that's the multidimensional matrix of neighbour deltas
rec(0, [], coord => coord.some(n => n) && sumMatrix.push(coord.concat()), _ => -1, _ => 1);

for (let cycle = 0; cycle < cycles; ++cycle) {
  rec(0, [], (coord) => {
    const neighbours = sumMatrix.reduce((acc, delta) => acc + get(w, coord, delta), 0);
    if (get(w, coord)) {
      put(aw, coord, neighbours === 2 || neighbours === 3 ? 1 : 0);
    } else {
      put(aw, coord, neighbours === 3 ? 1 : 0);
    }
  }, dimension => boundaries[dimension][0] - 1, dimensions => boundaries[dimensions][1] + 1);

  [w, aw] = [aw, w];
}

let cubes = 0;
rec(0, [], coord => cubes += get(w, coord), d => boundaries[d][0], d => boundaries[d][1]);

console.log(cubes);