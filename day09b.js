const fs = require('fs');
const data = fs.readFileSync('input09.txt', { encoding: 'utf8' });

const preambleLength = 25;
const numbers = data.split(/\r?\n/).map(n => +n);
let sums = [];
numbers.slice(0, preambleLength).forEach((n, i) => numbers.slice(0, preambleLength).forEach(m => sums.push(n == m ? 0 : n + m)));
outer:
for (let i = preambleLength, l = numbers.length; i < l; ++i) {
  const n = numbers[i];
  if (sums.indexOf(n) === -1) {
    for (let j = 0; j < i; ++j) {
      let sum = numbers[j];
      for (let k = j + 1; k < i; ++k) {
        sum += numbers[k];
        if (sum === n) {
          const range = numbers.slice(j, k + 1).sort((a,b) => a-b);
          console.log(range[0] + range[range.length - 1]);
          break outer;
        } else if (sum > n) {
          break;
        }
      }
    }
  }
  sums = sums.slice(preambleLength).concat(numbers.slice(i - preambleLength + 1, i + 1).map(m => n == m ? 0 : n + m ));
}

