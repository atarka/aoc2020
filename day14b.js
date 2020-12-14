const fs = require('fs');
const data = fs.readFileSync('input14.txt', { encoding: 'utf8' });

let set, unset, ones = (1n << 36n) - 1n;
const powers = [];
const memory = {};

data.split(/\r?\n/g).forEach(line => {
  const m = line.match(/^mem\[(.+?)\] = (\d+)/);
  if (m) {
    const addressBase = (BigInt(m[1]) | set) & unset;
    const powersLength = powers.length;
    for (let i = 0, l = (1 << powersLength); i < l; ++i) {
      let address = addressBase;
      for (let j = 0; j < powersLength; ++j) {
        if (i & (1 << j)) address += powers[j];
      }
      memory[address] = +m[2];
    }
  } else {
    powers.length = 0;
    set = 0n;
    unset = (1n << 36n) - 1n;

    line.substr(7).split('').reverse().forEach((c, i) => {
      if (c === '1') {
        set |= (1n << BigInt(i));
      } else if (c === 'X') {
        unset &= ~(1n << BigInt(i)) & ones;
        powers.push(1n << BigInt(i));
      }
    })
  }
})

const total = Object.keys(memory).filter(key => memory[key] > 0).reduce((acc, key) => acc + memory[key], 0);
console.log(total);

