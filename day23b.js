const fs = require('fs');
const data = `326519478`;

let cups = data.split('').map(n => +n);
const totalCups = 1000000;
let currentCup = cups[0];
let start = Math.max(...cups) + 1;
const minCup = Math.min(...cups);
for (let i = cups.length; i < totalCups; ++i) cups[i] = start++;
const list = new Array(start + totalCups);
for (let i = 0; i < totalCups; ++i) {
  list[cups[i]] = { v: cups[i], prev: i ? list[cups[i - 1]] : null, next: null };
  if (i) list[cups[i - 1]].next = list[cups[i]];
}
list[cups[0]].prev = list[cups[totalCups - 1]];
list[cups[totalCups - 1]].next = list[cups[0]];

const maxCup = start - 1;
let cup = list[currentCup];

for (let i = 0; i < 10000000; ++i) {
  const selected1 = cup.next;
  const selected2 = selected1.next;
  const selected3 = selected2.next;

  let destValue = cup.v;
  do {
    if (--destValue < minCup) destValue = maxCup;
    if (destValue !== selected1.v && destValue !== selected2.v && destValue !== selected3.v) break;
  } while (true);

  const dest = list[destValue];
  // lets rewrite references for choppity chop
  cup.next = selected3.next;
  selected3.next.prev = cup;
  selected1.prev = dest; // list[destValue];
  selected3.next = dest.next;
  dest.next.prev = selected3;
  dest.next = selected1;
  cup = cup.next;
}

console.log(list[1].next.v * list[1].next.next.v);
