const fs = require('fs');
const data = fs.readFileSync('input12.txt', { encoding: 'utf8' });

let x = 0, y = 0, wx = 10, wy = -1;
const rotate = (x, y, a) => {
  switch (a) {
    case 90: return [-y, x];
    case 180: return [-x, -y];
    case 270: return [y, -x];
    default:  return [x, y];
  }
}

[...data.matchAll(/([RLNESWF])(\d+)/g)].forEach(m => {
  const value = +m[2];
  switch (m[1]) {
    case 'L': [wx, wy] = rotate(wx, wy, 360 - value); break;
    case 'R': [wx, wy] = rotate(wx, wy, +value); break;
    case 'N': wy -= value; break;
    case 'E': wx += value; break;
    case 'S': wy += value; break;
    case 'W': wx -= value; break;
    case 'F': [x, y] = [x + wx * value, y + wy * value]; break;
  }
})

console.log(Math.abs(x) + Math.abs(y));
