// Flags: --expose-internals

'use strict';

require('../common');
const assert = require('assert');

const {
  kIsDestroyed,
  kIsErrored,
  kIsReadable,
  kIsWritable,
  kIsDisturbed,
} = require('internal/streams/utils');

{
  assert.strictEqual(kIsDestroyed, Symbol.for('nodejs.stream.destroyed'));
  assert.strictEqual(kIsErrored, Symbol.for('nodejs.stream.errored'));
  assert.strictEqual(kIsReadable, Symbol.for('nodejs.stream.readable'));
  assert.strictEqual(kIsWritable, Symbol.for('nodejs.stream.writable'));
  assert.strictEqual(kIsDisturbed, Symbol.for('nodejs.stream.disturbed'));
}
