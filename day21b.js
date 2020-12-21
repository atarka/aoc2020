const fs = require('fs');
const data = fs.readFileSync('input21.txt', { encoding: 'utf8' });

const diff = (a, b) => a.filter(value => !b.includes(value));
const intersect = (a, b) => a.filter(value => b.includes(value));

const food = [];
const ingredients = {};
const allergens = {};
[...data.matchAll(/(.+?) \(contains (.+?)\)/g)].forEach(m => {
  const foodItem = { ingredients: m[1].split(' '), allergens: m[2].split(', ') };
  foodItem.ingredients.forEach(ingredient => ingredients[ingredient] = (ingredients[ingredient] || 0) + 1);
  foodItem.allergens.forEach(allergen => allergens[allergen] = true)
  food.push(foodItem);
});

const resolved = [];
const allergensList = Object.keys(allergens);
const allergic = {};
let gotSomething;

do {
  gotSomething = false;

  allergensList.forEach(allergen => {
    if (resolved.includes(allergen)) return;
    let interA = null;
    let interF = null;

    for (let i = 0; i < food.length; ++i) {
      if (!food[i].allergens.includes(allergen)) continue;
      interA = interA ? intersect(interA, diff(food[i].allergens, resolved)) : diff(food[i].allergens, resolved);
      interF = interF ? intersect(interF, diff(food[i].ingredients, resolved)) : diff(food[i].ingredients, resolved);
    }

    if (interA.length === 1 && interF.length === 1) {
      allergic[interF[0]] = interA[0];
      resolved.push(interA[0]);
      resolved.push(interF[0]);
      gotSomething = true;
    }
  })
} while (gotSomething);

const count = Object.keys(ingredients).filter(ingredient => !resolved.includes(ingredient))
  .reduce((acc, ingredient) => acc + ingredients[ingredient], 0);
console.log(`Count: count`);

const reversed = {};
Object.keys(allergic).forEach(key => reversed[allergic[key]] = key);
console.log(`List: ${Object.keys(reversed).sort().map(key => reversed[key]).join(',')}`);
