const fs = require('fs');
const steps = 30000000;
const spoken = new Array(steps);
[2, 15, 0, 9, 1].forEach((n, i) => spoken[n] = i + 1);
let lastNumber = 20;

for (let i = 6; i < steps; ++i) {
  const last = spoken[lastNumber];
  spoken[lastNumber] = i;
  lastNumber = last ? i - last : 0;
}

console.log(lastNumber);