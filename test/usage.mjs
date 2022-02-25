// -*- coding: utf-8, tab-width: 2 -*-

import felidae from 'exdata-taxonomy-misc-felidae';
import eq from 'equal-pmb';

import makeFilter from '../fce.mjs';
// externally: import forf from 'filter-container-entries-pmb';

const catSpc = felidae.findByType('species').dict;

function isOdd(x) { return ((x % 2) === 1); }
const oddSpc = makeFilter({ dive: '.wp-en.oldid', decide: isOdd })(catSpc);
eq(oddSpc, {
  leo: { '': 'species', 'wp-en': { '': 'wp', oldid: 741625599 } },
  nebulosa: { '': 'species', 'wp-en': { '': 'wp', oldid: 742251401 } },
  rufus: { '': 'species', 'wp-en': { '': 'wp', oldid: 742216395 } },
});

function wpId(x) { return x['wp-en'].oldid; }
eq(oddSpc, makeFilter({ extract: wpId, decide: isOdd })(catSpc));

function hasLongKey(val, key) { return key.length > 3; }

const longOddSpc = makeFilter({
  decide: hasLongKey,
  outFmt: 'keys',
})(oddSpc);
eq(longOddSpc, ['nebulosa', 'rufus']);

const shortOddSpc = makeFilter({
  decide: hasLongKey,
  outFmt: 'keys',
  negate: true,
})(oddSpc);
eq(shortOddSpc, ['leo']);


console.info('+OK usage tests passed');
