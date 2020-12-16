const fs = require('fs');
const data = fs.readFileSync('input16.txt', { encoding: 'utf8' });

const [, rulesBlock, mine, theirs ] = data.match(/(.+?)\r?\n\r?\nyour ticket:\r?\n(.+?)\r?\n\r?\nnearby tickets:\r?\n(.+)/s);
const rules = [];
const couldBe = {};

// lets map all rules to a map that shows possible class names for every possible value
[...rulesBlock.matchAll(/(.+?): (.+)/g)].forEach(ruleBlock => {
  const [, name, ruleConditions] = ruleBlock;
  const ranges = {};
  ruleConditions.split(/ or /g).forEach(range => {
    const [from, to] = range.split('-');
    for (let i = +from; i <= to; ++i) {
      ranges[i] = true;
      if (!couldBe[i]) couldBe[i] = [];
      couldBe[i].push(name);
    }
  })
  rules.push(name);
})

const tickets = theirs.split(/\r?\n/g).filter(ticket => ticket.split(',').every(n => couldBe[n]));
const order = [];

// now we get possible classes for every ticket value position
tickets.forEach(ticket => ticket.split(',').forEach((n, i) => {
    if (order[i]) {
      order[i] = order[i].filter(value => couldBe[n].includes(value));
    } else {
      order[i] = couldBe[n];
    }
}))

const diff = (a, b) => a.filter(value => !b.includes(value));
const resolvedFields = [];
const resolved = {};

// and now we just find out value position by iteratively filtering out positions that we can definitely map to a single class
while (resolvedFields.length !== rules.length) {
  for (let i = 0; i < order.length; ++i) {
    const one = diff(order[i], resolvedFields);
    if (one.length === 1) {
      resolvedFields.push(one[0]);
      resolved[one[0]] = i;
    }
  }
}

const myTicket = mine.split(',');
const product = Object.keys(resolved)
  .filter(key => key.match(/^departure/i))
  .reduce((acc, key) => acc * myTicket[resolved[key]], 1);

console.log(product);
