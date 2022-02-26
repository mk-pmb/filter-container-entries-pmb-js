
<!--#echo json="package.json" key="name" underline="=" -->
filter-container-entries-pmb
============================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Filter an array, map, object or set, with advanced options.
<!--/#echo -->



API
---

This module exports one function:

### makeFilter(opt)

Returns a filter function that expects one argument, `input`.

`opt` is an optional options object that supports these optional keys:

* `decide`: The function that decides what to keep.
  It will be called with arguments according to option `inFmt`.
  Default: the buil-in `Boolean`.
* `negate`: If true-y, negate the results of `decide`.
* `dive`: If set to something other than `undefined`,
  the `value` passed to `decide` will be extracted from somewhere inside the
  original value by diving along the path given in `dive` as understood by
  module [`objdive`](https://github.com/mk-pmb/objdive-js).
* `extract`: If set to a function, similar to the `dive` option,
  extract the value to be filtered. Applies before potential `dive`-ing.
* `inFmt`: (input format) What arguments to call `decide` with.
  * `undefined` (default): `(value, key, input)`
  * `'entries'`: `(entry, index, input)` where `entry = [key, value]`.
* `outFmt`: (output format) How to deliver the results:
  * `undefined` (default): same container type as input was.
  * `'entries'`: array of `[key, value]` pairs.
  * `'keys'`: array of matching keys from `input`
  * `'values'`: array of matching values from `input`
  * `'dict'`: plain Object.
    Useful if `input` is a Map and you want to convert the output to JSON.
  * `'nobj'`: an Object with `null` prototype.
* `empty`: If set to something other than `undefined`,
  instead of an empty result, return `empty`.




Usage
-----

see [test/usage.mjs](test/usage.mjs)


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
