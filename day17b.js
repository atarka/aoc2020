const fs = require('fs');
const data = fs.readFileSync('input17.txt', { encoding: 'utf8' });

const world = {}, anotherWorld = {};
const boundaries = {x: [0, 0], y: [0, 0], z: [0, 0], h: [0, 0]};
const put = (world, x, y, z, h, v) => {
  if (!world[h]) world[h] = {};
  if (!world[h][z]) world[h][z] = {};
  if (!world[h][z][y]) world[h][z][y] = {};
  world[h][z][y][x] = v;
  if (v) {
    boundaries.x[0] = Math.min(boundaries.x[0], x);
    boundaries.x[1] = Math.max(boundaries.x[1], x);
    boundaries.y[0] = Math.min(boundaries.y[0], y);
    boundaries.y[1] = Math.max(boundaries.y[1], y);
    boundaries.z[0] = Math.min(boundaries.z[0], z);
    boundaries.z[1] = Math.max(boundaries.z[1], z);
    boundaries.h[0] = Math.min(boundaries.h[0], h);
    boundaries.h[1] = Math.max(boundaries.h[1], h);
  }
}

const get = (world, x, y, z, h) => (world[h] && world[h][z] && world[h][z][y] && world[h][z][y][x]) ? 1 : 0;

data.split(/\r?\n/g)
  .forEach((row, y) =>
    row.split('').forEach((cell, x) => cell === '#' ? put(world, x, y, 0, 0, 1) : null));

let w = world, aw = anotherWorld;
for (let cycle = 0; cycle < 6; ++cycle) {
  for (let h = boundaries.h[0] - 1; h <= boundaries.h[1] + 1; ++h) {
    for (let z = boundaries.z[0] - 1; z <= boundaries.z[1] + 1; ++z) {
      for (let y = boundaries.y[0] - 1; y <= boundaries.y[1] + 1; ++y) {
        for (let x = boundaries.x[0] - 1; x <= boundaries.x[1] + 1; ++x) {
          let neighbours = 0;
          for (let dh = -1; dh <= 1; ++dh) {
            for (let dz = -1; dz <= 1; ++dz) {
              for (let dy = -1; dy <= 1; ++dy) {
                for (let dx = -1; dx <= 1; ++dx) {
                  if (!dx && !dy && !dz && !dh) continue;
                  neighbours += get(w, x + dx, y + dy, z + dz, h + dh);
                }
              }
            }
          }

          if (get(w, x, y, z, h)) {
            put(aw, x, y, z, h, neighbours === 2 || neighbours === 3 ? 1 : 0);
          } else {
            put(aw, x, y, z, h, neighbours === 3 ? 1 : 0);
          }
        }
      }
    }
  }

  [w, aw] = [aw, w];
}


let cubes = 0;
for (let h = boundaries.h[0] - 1; h <= boundaries.h[1] + 1; ++h) {
  for (let z = boundaries.z[0] - 1; z <= boundaries.z[1] + 1; ++z) {
    for (let y = boundaries.y[0] - 1; y <= boundaries.y[1] + 1; ++y) {
      for (let x = boundaries.x[0] - 1; x <= boundaries.x[1] + 1; ++x) {
        cubes += get(w, x, y, z, h);
      }
    }
  }
}

console.log(cubes);
