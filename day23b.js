const fs = require('fs');
const data = `326519478`;

let cups = data.split('').map(n => +n);
const totalCups = 1000000;
let maxCup = Math.max(...cups);
const minCup = Math.min(...cups);
const list = new Array(totalCups + maxCup);

for (let i = totalCups - 1, next = null, v; i >= 0; --i, next = list[v]) {
  v = i < cups.length ? cups[i] : maxCup + i - cups.length + 1;
  list[v] = { v, next };
}
maxCup += totalCups - cups.length;
list[maxCup].next = list[cups[0]];

let cup = list[cups[0]];

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
  cup.next = selected3.next;
  selected3.next = dest.next;
  dest.next = selected1;
  cup = cup.next;
}

console.log(list[1].next.v * list[1].next.next.v);
