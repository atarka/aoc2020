const fs = require('fs');
const data = `326519478`;

let cups = data.split('').map(n => +n);
const totalCups = 1000000;
let current = cups[0];
let start = Math.max(...cups) + 1;
const minCup = Math.min(...cups);
for (let i = cups.length; i < totalCups; ++i) cups[i] = start++;
const list = {};
for (let i = 0; i < totalCups; ++i) {
  list[cups[i]] = { v: cups[i], prev: i ? list[cups[i - 1]] : null, next: null };
  if (i) list[cups[i - 1]].next = list[cups[i]];
}
list[cups[0]].prev = list[cups[totalCups - 1]];
list[cups[totalCups - 1]].next = list[cups[0]];

const maxCup = start - 1;

const getList = (start, howMuch) => {
  const items = [];
  for (let i = 0; i < howMuch; ++i, start = start.next) items.push(start.v);
  return items;
}

for (let i = 0; i < 10000000; ++i) {
  const selected = getList(list[current].next, 3)

  let destValue = current;
  do {
    if (--destValue < minCup) destValue = maxCup;
    if (!selected.includes(destValue)) break;
  } while (true);

  // lets rewrite references for choppity chop
  list[current].next = list[selected[2]].next;
  list[selected[2]].next.prev = list[current];
  list[selected[0]].prev = list[destValue];
  list[selected[2]].next = list[destValue].next;
  list[destValue].next.prev = list[selected[2]];
  list[destValue].next = list[selected[0]];
  current = list[current].next.v;
}

console.log(list[1].next.v * list[1].next.next.v);
