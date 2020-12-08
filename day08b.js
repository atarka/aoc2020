const fs = require('fs');
const data = fs.readFileSync('input08.txt', { encoding: 'utf8' });

class Machine {
  acc;
  curr;
  code;

  constructor (code) {
    this.code = [];
    this.parse(code);
  }

  parse (code) {
    [...code.matchAll(/([a-z]+) ([+-]?[0-9]+)/g)].forEach(m => this.code.push({ instruction: m[1], op1: +m[2] }));
  }

  cb (callback) {
    const res = callback(this);
    if (res === 'stop') {
      throw new ({ msg: 'stopped' });
    }
  }

  run (opt) {
    this.curr = 0;
    this.acc = 0;

    try {
      while (this.curr < this.code.length) {
        if (opt.before) this.cb(opt.before);
        const instruction = opt.fetch && opt.fetch(machine) || this.code[this.curr];

        switch (instruction.instruction) {
          case 'nop':
            break;
          case 'acc':
            this.acc += instruction.op1;
            break;
          case 'jmp':
            this.curr += instruction.op1 - 1;
            break;
          default:
            throw new ({msg: 'invalid operation'});
        }

        ++this.curr;
        if (opt.after) this.cb(opt.after);
      }
      return true;

    } catch (e) {
      return false;
    }
  }
}

const machine = new Machine(data);

for (let count = 0;; ++count) {
  let encountered = 0;
  const visited = {};

  const res = machine.run({
    before: machine => {
      if (visited[machine.curr]) {
        console.log(`stopped acc: ${machine.acc}`);
        return 'stop';
      }
      visited[machine.curr] = true;
    },
    fetch: machine => {
      const instruction = machine.code[machine.curr];
      if (instruction.instruction === 'nop') {
        if (encountered++ === count) {
          return { ...instruction, instruction: 'jmp' }
        }
      } else if (instruction.instruction === 'jmp') {
        if (encountered++ === count) {
          return { ...instruction, instruction: 'nop' }
        }
      }
    }
  });

  if (res) {
    console.log(`acc: ${machine.acc}`);
    break;
  }
}