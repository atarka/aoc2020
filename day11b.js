const fs = require('fs');
const data = fs.readFileSync('input11.txt', { encoding: 'utf8' });

const seats = data.split(/\r?\n/);
let ppl = seats.map(row => row.split('').map(_ => '.'));
const ref = { changed: false, seats: 0 };

const liveALife = (ppl, ref) => ppl.map((row, y) => row.map((seat, x) => {
  if (seats[y][x] !== 'L') return '.';
  let occupants = 0;
  for (j = -1; j <= 1; ++j) {
    for (i = -1; i <= 1; ++i) {
      if (!j && !i) continue;
      for (let sx = x + i, sy = y + j; sx >= 0 && sx < row.length && sy >= 0 && sy < ppl.length; sx += i, sy += j) {
        if (seats[sy][sx] === '.') continue;
        if (ppl[sy][sx] === '#') ++occupants;
        break;
      }
    }
  }

  let status = seat;
  if (occupants >= 5) {
    status = '.';
  } else if (!occupants) {
    status = '#';
  }

  ref.changed |= (seat !== status);
  ref.seats += status === '#';

  return status;
}));

do {
  ref.changed = false;
  ref.seats = 0;
  ppl = liveALife(ppl, ref);
} while (ref.changed);

console.log(ref.seats);

