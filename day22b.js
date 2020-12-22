const fs = require('fs');
const data = fs.readFileSync('input22.txt', { encoding: 'utf8' });

const [, player1, player2] = data.match(/Player 1:\r?\n(.+)\r?\n\r?\nPlayer 2:\r?\n(.+)/s);
const stack1 = player1.split(/\r?\n/).map(n => +n);
const stack2 = player2.split(/\r?\n/).map(n => +n);

const playAGame = (stack1, stack2) => {
  const playedHashes = {};

  while (stack1.length && stack2.length) {
    const hash = stack1.join(',') + ':' + stack2.join(',');
    if (playedHashes[hash]) return { winner: 1, stack: stack1 };
    playedHashes[hash] = true;

    const card1 = stack1.shift();
    const card2 = stack2.shift();

    let winner = null;
    if (card1 <= stack1.length && card2 <= stack2.length) {
      winner = playAGame(stack1.slice(0, card1), stack2.slice(0, card2)).winner;
    } else {
      winner = card1 > card2 ? 1 : 2;
    }

    if (winner === 1) {
      stack1.push(card1);
      stack1.push(card2);
    } else {
      stack2.push(card2);
      stack2.push(card1);
    }
  }

  if (stack1.length) {
    return { winner: 1, stack: stack1 };
  } else {
    return { winner: 2, stack: stack2 };
  }
}

const result = playAGame(stack1, stack2);
console.log(result.stack.reverse().reduce((acc, value, index) => acc + value * (index + 1), 0));
