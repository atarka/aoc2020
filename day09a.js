const fs = require('fs');
const data = fs.readFileSync('input09.txt', { encoding: 'utf8' });

const preambleLength = 25;
const numbers = data.split(/\r?\n/).map(n => +n);
let sums = [];
numbers.slice(0, preambleLength).forEach((n, i) => numbers.slice(0, preambleLength).forEach(m => sums.push(n == m ? 0 : n + m)));
for (let i = preambleLength, l = numbers.length; i < l; ++i) {
  const n = numbers[i];
  if (sums.indexOf(n) === -1) {
    console.log(`num: ${n}`);
    break;
  }
  sums = sums.slice(preambleLength).concat(numbers.slice(i - preambleLength + 1, i + 1).map(m => n == m ? 0 : n + m ));
}

