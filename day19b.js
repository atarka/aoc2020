const fs = require('fs');
const data = fs.readFileSync('input19.txt', { encoding: 'utf8' });

const [ rules, lines ] = data.split(/\r?\n\r?\n/);
const ruleLines = [];
rules.split(/\r?\n/).forEach((rule) => {
  const [, ruleNumber, ruleCondition] = rule.match(/(\d+): (.+)/);
  ruleLines[+ruleNumber] = ruleCondition;
});

ruleLines[8] = '42 | 42 8';
ruleLines[11] = '42 31 | 42 11 31';

const resolvedRules = [];
const resolveRule = (ruleId, nestedCount = 0) => {
  if (!resolvedRules[ruleId]) {
    if (nestedCount > 10) return '';
    const rule = ruleLines[ruleId];

    if (rule.match(/"."/)) {
      resolvedRules[ruleId] = rule.substr(1, 1);
    } else {
      const ruleParts = rule.split(' | ')
        .map(rule => rule.split(' ')
          .map(subRule => resolveRule(subRule, nestedCount + (ruleId == subRule)))
          .join(''));
      resolvedRules[ruleId] = '(' + ruleParts.join('|') + ')';
    }
  }

  return resolvedRules[ruleId];
}

const ruleToRuleThemAll = new RegExp('^' + resolveRule(0) + '$');
console.log(lines.split(/\r?\n/).filter(line => ruleToRuleThemAll.exec(line)).length);