// -*- coding: utf-8, tab-width: 2 -*-

import getOwn from 'getown';
import objDive from 'objdive';


function ownEntries(x) { return x.entries(); }

const typeSwitch = {

  guess(x) {
    if (Array.isArray(x)) { return typeSwitch.Array; }
    const typeName = Object.prototype.toString.call(x).slice(8, -1);
    const typeHow = getOwn(typeSwitch, typeName);
    if (typeHow && typeHow.fromEntries) { return typeHow; }
    throw new TypeError('Unsupported input type ' + typeName);
  },

  Array: {
    entries: Object.entries,
    fromEntries(e) { return Object.assign([], Object.fromEntries(e)); },
  },

  Object,
  Map: { entries: ownEntries, fromEntries(e) { return new Map(e); } },
  Set: { entries: ownEntries, fromEntries(e) { return new Set(e); } },

};


function funcNegate(f) { return function g(v, a, b) { return !f(v, a, b); }; }


function funcUnpair(f) {
  return function g(p, i, l) { return f(p[1], p[0], l); };
}


function maybeDiveFirst(d, f) {
  if (d === undefined) { return f; }
  return function g(v, a, b) { return f(objDive(v, d), a, b); };
}


function maybeExtractFirst(e, f) {
  return (e ? function g(v, a, b) { return f(e(v, a, b), a, b); } : f);
}


const outputWrapers = {
  entries(ent) { return ent; },
  keys(ent) { return ent.map(e => e[0]); },
  values(ent) { return ent.map(e => e[1]); },
};


function makeFilterCore(decide, outWrap, empty) {
  // Purpose of this function: Build the filterContainerEntries function
  // in a scope that does not hold a reference to the original `opt`.
  const fce = function filterContainerEntries(input) {
    if (!input) { return false; }
    const typeHow = typeSwitch.guess(input);
    const keep = typeHow.entries(input).filter(decide);
    if (keep.length || (empty === undefined)) {
      return (outWrap || typeHow.fromEntries)(keep);
    }
    return empty;
  };
  return fce;
}


function makeFilter(opt) {
  if (!opt) { return makeFilter(true); }

  let decide = opt.decide || Boolean;
  if (opt.negate) { decide = funcNegate(decide); }
  decide = maybeDiveFirst(opt.dive, decide);
  decide = maybeExtractFirst(opt.extract, decide);

  const { inFmt } = opt;
  if (inFmt !== 'entries') { decide = funcUnpair(decide); }

  const outWrap = getOwn(outputWrapers, opt.outFmt);
  return makeFilterCore(decide, outWrap, opt.empty);
}


export default makeFilter;
