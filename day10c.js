const fs = require('fs');
const data = fs.readFileSync('input10.txt', { encoding: 'utf8' });
const adapters = data.trim().split(/\r?\n/).map(i => +i);

adapters.sort((a, b) => a - b);
adapters.unshift(0); // + power outlet at the start
adapters.push(adapters[adapters.length-1] + 3); // + target device at the end

// --- Part One ---

let gaps = [0, 0, 0, 0];
for (let i = 0; i < adapters.length - 1; i++) {
  const current = adapters[i];
  const next = adapters[i+1];
  gaps[next - current]++;
}

console.log(gaps[1] * gaps[3]);

// --- Part Two ---

let groups = [0, 0, 0, 0, 0, 0];
let groupIndex = 0;
for (let i = 0; i < adapters.length - 1; i++) {
  groupIndex++;
  const current = adapters[i];
  const next = adapters[i+1];
  if (next - current === 3) {
    groups[groupIndex]++;
    groupIndex = 0;
  }
}

console.log(
  Math.pow(2, groups[3]) * // in a group of 3, we can switch 1 central element = 2 combinations
  Math.pow(4, groups[4]) * // in a group of 4, we can switch 2 central elements = 2^2 = 4 combinations
  Math.pow(7, groups[5])   // in a group of 5, we can switch 3 central elements (but not all 3 together) = 2^3-1 = 7 combinations
);