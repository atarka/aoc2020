const fs = require('fs');
const data = fs.readFileSync('input10.txt', { encoding: 'utf8' });

const input = data.split(/\r?\n/).map(n => +n).sort((a, b) => a - b);
const jolts = [0, ...input, input[input.length - 1] + 3];

const permutations = adapters => {
  const power = 1 << (adapters.length - 2);
  const first = adapters[0];
  const last = adapters[adapters.length - 1];
  let variants = 0;

  for (let i = 0; i < power; ++i) {
    const chain = [first, ...adapters.slice(1, adapters.length - 1).filter((v, index) => i & (1 << index)), last];
    variants += chain.reduce((acc, n, i, v) => (i && n - v[i - 1] > 3) ? 0 : acc, 1);
  }

  return variants;
}

const chain = [];
let variants = 1;

for (let i = 0, l = jolts.length; i < l; ++i) {
  const jolt = jolts[i];
  if (jolt - jolts[i - 1] === 3) { // lets process the subchain for variations
    variants *= chain.length > 2 ? permutations(chain) : 1;
    chain.length = 0;
  }
  chain.push(jolt);
}

console.log(variants);
