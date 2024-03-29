// -*- coding: utf-8, tab-width: 2 -*-

import eq from 'equal-pmb';

import makeFilter from '../fce.mjs';
// externally: import makeFilter from 'filter-container-entries-pmb';

const sandwichObj = {
  bun:    { amount: 1, unit: 'ea', toasted: true },
  cheese: { amount: 1, unit: 'slice' },
  dirt:   false,
  egg:    { amount: 3, unit: 'slice', boiled: 'hard' },
  pickle: { amount: 4, unit: 'slice' },
};
const sandwichMap = new Map(Object.entries(sandwichObj));
const sandwichSet = new Set(Object.keys(sandwichObj));

eq(sandwichSet.has('dirt'), true);
// ^- Because in a Set, the value always is the key.
//    That's what we get from ignoring the recipe details.

const relevantIngredients = makeFilter()(sandwichObj);
eq(Object.keys(relevantIngredients), ['bun', 'cheese', 'egg', 'pickle']);

const omittedIngredients = makeFilter({ negate: true })(sandwichObj);
eq(omittedIngredients, { dirt: false });

let toasted = makeFilter({ dive: 'toasted' })(sandwichObj);
const { bun } = sandwichObj;
eq(toasted, { bun });

eq(makeFilter({ dive: 'toasted' })(sandwichMap), new Map([['bun', bun]]));

toasted = makeFilter({ dive: 'toasted', outFmt: 'dict' })(sandwichMap);
eq(toasted, { bun });
eq(typeof toasted.hasOwnProperty, 'function');

toasted = makeFilter({ dive: 'toasted', outFmt: 'nobj' })(sandwichMap);
eq(Object.keys(toasted), ['bun']);
eq(toasted.bun, bun);
eq(toasted.hasOwnProperty, undefined);

eq(makeFilter({ dive: 'fried' })(sandwichObj), {});
eq(makeFilter({ dive: 'fried', empty: false })(sandwichObj), false);
eq(makeFilter({ dive: 'fried', empty: 42 })(sandwichObj), 42);
eq(makeFilter({ dive: 'toasted', empty: 42 })(sandwichObj), { bun });

eq(makeFilter({ dive: 'fried' })(sandwichMap).size, 0);
eq(makeFilter({ dive: 'fried', empty: false })(sandwichMap), false);
eq(makeFilter({ dive: 'fried', empty: 42 })(sandwichMap), 42);
eq(makeFilter({ dive: 'toasted', empty: 42 })(sandwichMap).size, 1);

function isEven(x) { return ((x % 2) === 0); }
function evenAmount(ingredient) { return isEven(ingredient.amount); }

const evenIngredients = makeFilter({ decide: evenAmount })(sandwichObj);
const { pickle } = sandwichObj;
eq(evenIngredients, { pickle });
eq(makeFilter({ decide: isEven, dive: 'amount' })(sandwichObj), { pickle });

const evenIngrMap = makeFilter({ decide: evenAmount })(sandwichMap);
eq(evenIngrMap.size, 1);
eq(evenIngrMap.get('pickle'), pickle);

const wholeIngredients = makeFilter({
  dive: 'unit',
  decide(u) { return u === 'ea'; },
  outFmt: 'keys',
})(sandwichMap);
eq(wholeIngredients, ['bun']);

function wordWithK(s) { return s.includes('k'); }

const ingrWithK = makeFilter({ decide: wordWithK })(sandwichSet);
eq(ingrWithK.size, 1);
eq(ingrWithK.has('pickle'), true);

const noK = makeFilter({ decide: wordWithK, negate: true })(sandwichSet);
eq(noK.size, 4);
eq(noK.has('bun'), true);
eq(noK.has('cheese'), true);
eq(noK.has('egg'), true);
eq(noK.has('dirt'), true); // see earlier
eq(noK.has('pickle'), false);



console.info('+OK usage tests passed');
