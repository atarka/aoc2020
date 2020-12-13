const fs = require('fs');
const data = fs.readFileSync('input13.txt', { encoding: 'utf8' });

const [timestamp, busses] = data.split(/\r?\n/);
const busNumbers = busses.split(/,/g).map(n => +n);

let currentPeriod = busNumbers[0];
let start = busNumbers[0];
for (let i = 1; i < busNumbers.length; ++i) {
  const number = busNumbers[i];
  if (isNaN(number)) continue;
  const need = (number - i + number * 100) % number;
  for (let p = start;; p += currentPeriod) {
    if (p % number === need) {
      currentPeriod *= number;
      start = p;
      break;
    }
  }
}

console.log(start);