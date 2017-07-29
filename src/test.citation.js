require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function placeHoldersCount(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);

  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0; i < l; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('');
}

},{}],2:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict';

var base64 = require('base64-js');
var ieee754 = require('ieee754');

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
  console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}

function typedArraySupport() {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42;
  } catch (e) {
    return false;
  }
}

function createBuffer(length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length');
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length);
  buf.__proto__ = Buffer.prototype;
  return buf;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(arg);
  }
  return from(arg, encodingOrOffset, length);
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  });
}

Buffer.poolSize = 8192; // not used by this implementation

function from(value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset);
  }

  return fromObject(value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length);
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype;
Buffer.__proto__ = Uint8Array;

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
  }
  return createBuffer(size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding);
};

function allocUnsafe(size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0);
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size);
};

function fromString(string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  var buf = createBuffer(length);

  var actual = buf.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }

  return buf;
}

function fromArrayLike(array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  var buf = createBuffer(length);
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }
  return buf;
}

function fromArrayBuffer(array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  var buf;
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype;
  return buf;
}

function fromObject(obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    var buf = createBuffer(len);

    if (buf.length === 0) {
      return buf;
    }

    obj.copy(buf, 0, 0, len);
    return buf;
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return b != null && b._isBuffer === true;
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (numberIsNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0;
    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf = this.subarray(start, end);
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype;
  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset + 3] = value >>> 24;
  this[offset + 2] = value >>> 16;
  this[offset + 1] = value >>> 8;
  this[offset] = value & 0xff;
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  this[offset + 2] = value >>> 16;
  this[offset + 3] = value >>> 24;
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : new Buffer(val, encoding);
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView(obj) {
  return typeof ArrayBuffer.isView === 'function' && ArrayBuffer.isView(obj);
}

function numberIsNaN(obj) {
  return obj !== obj; // eslint-disable-line no-self-compare
}

},{"base64-js":1,"ieee754":3}],3:[function(require,module,exports){
"use strict";

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

},{}],4:[function(require,module,exports){
'use strict';

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

},{}],5:[function(require,module,exports){
module.exports={"entities":{"Q21972834":{"pageid":24004990,"ns":0,"title":"Q21972834","lastrevid":468197350,"modified":"2017-03-19T14:57:48Z","type":"item","id":"Q21972834","labels":{"en":{"language":"en","value":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data"},"nl":{"language":"nl","value":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data"}},"descriptions":{"en":{"language":"en","value":"scientific article"},"nl":{"language":"nl","value":"wetenschappelijk artikel (gepubliceerd op 2013/06/15)"},"cs":{"language":"cs","value":"v\u011bdeck\u00fd \u010dl\u00e1nek publikovan\u00fd v roce 2013"},"fr":{"language":"fr","value":"article scientifique (publi\u00e9 2013/06/15)"},"it":{"language":"it","value":"articolo scientifico (pubblicato il 2013/06/15)"},"da":{"language":"da","value":"videnskabelig artikel (udgivet  2013/06/15)"},"sk":{"language":"sk","value":"vedeck\u00fd \u010dl\u00e1nok (publikovan\u00fd 2013/06/15)"},"pt":{"language":"pt","value":"artigo cient\u00edfico (publicado na 2013/06/15)"},"hy":{"language":"hy","value":"\u0563\u056b\u057f\u0561\u056f\u0561\u0576 \u0570\u0578\u0564\u057e\u0561\u056e"}},"aliases":[],"claims":{"P698":[{"mainsnak":{"snaktype":"value","property":"P698","datavalue":{"value":"23698863","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$D435A2F3-E2A8-45A7-922A-A6BB72F9A79C","rank":"normal"}],"P932":[{"mainsnak":{"snaktype":"value","property":"P932","datavalue":{"value":"3673215","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$F4959183-FB89-410E-BF33-DF9B1AF81ECE","rank":"normal"}],"P31":[{"mainsnak":{"snaktype":"value","property":"P31","datavalue":{"value":{"entity-type":"item","numeric-id":13442814,"id":"Q13442814"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$E4DCC072-BD1A-4FDF-BFED-E1D981E5E81F","rank":"normal"}],"P1476":[{"mainsnak":{"snaktype":"value","property":"P1476","datavalue":{"value":{"text":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q21972834$D8C2FFB6-2710-4AFA-92A3-A859ABAA1FED","rank":"normal"}],"P364":[{"mainsnak":{"snaktype":"value","property":"P364","datavalue":{"value":{"entity-type":"item","numeric-id":1860,"id":"Q1860"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$D55F7830-D04D-48B0-B739-9E4CC9B2F275","rank":"normal"}],"P478":[{"mainsnak":{"snaktype":"value","property":"P478","datavalue":{"value":"29","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$963935D7-041A-4E92-9D9B-F254A5426BAD","rank":"normal"}],"P433":[{"mainsnak":{"snaktype":"value","property":"P433","datavalue":{"value":"12","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$47B925A9-A53F-43A3-888D-BEA79E399D4D","rank":"normal"}],"P577":[{"mainsnak":{"snaktype":"value","property":"P577","datavalue":{"value":{"time":"+2013-06-15T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"},"type":"statement","id":"Q21972834$9EDE475C-7403-4A66-A6A5-0458E7782689","rank":"normal"}],"P304":[{"mainsnak":{"snaktype":"value","property":"P304","datavalue":{"value":"1492-7","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$92D5DD57-B5F0-42B6-9508-6D5CEB82FF3C","rank":"normal"}],"P2093":[{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Inanc Birol","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"862c83ca2949d7eb8f41b4bf1a4521ed18cdebb8","datavalue":{"value":"1","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CCE7BCBB-5804-4CCA-B762-83EEA827F32D","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Anthony Raymond","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"af1310a34ec80620d4fdd7bb8ca76e492fe6630e","datavalue":{"value":"2","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$BC54A9F8-68FF-4F6E-8111-A449A15BDB57","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Shaun D Jackman","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"3c1e388cba3487113121af5bfa59a2f657bf21bd","datavalue":{"value":"3","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CB76DCFD-DA2A-4673-ACDB-B8CA71D1069C","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Stephen Pleasance","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a82b0aa3ccf1a266e15473824b4391f6d9da4be0","datavalue":{"value":"4","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CC360BCE-0D0D-4E92-8F68-1780D1106620","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Robin Coope","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c8e1b85012703eb0f44ff876ec773596f3794872","datavalue":{"value":"5","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$EC1B7589-BE7F-450C-B4AE-978EF4440682","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Greg A Taylor","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5d30572c5a5693878a66231c29c9bb3e4a870527","datavalue":{"value":"6","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$AA1A005B-0985-4CCB-AB13-782A3385EB54","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Macaire Man Saint Yuen","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ecdcd65e6c9f103dedc06d856ce957af15050f7b","datavalue":{"value":"7","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$A0812623-AA81-48CB-AA51-1E04CCC21FE9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Christopher I Keeling","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c6a0d2bbafefdc6d21b25af4357c9887085c2f89","datavalue":{"value":"8","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$10084000-8CC4-466F-8FCC-E391C12D9C27","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Dana Brand","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ebbb7b4bd5f12eaa0eb9415b51fd725fd993a644","datavalue":{"value":"9","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$6A62350D-4505-43DF-A8D4-719B8282ED8E","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Benjamin P Vandervalk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"6d824c4548dc9c84054b9e446b8ea72e50efebba","datavalue":{"value":"10","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$B78884CC-1F88-45B1-B1B3-DD9DDF2B2FBE","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Heather Kirk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"938c75f8b1bafb9e19a4c1a079b8b8e5d997c7fa","datavalue":{"value":"11","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$C9117C71-EAEB-4DC0-909B-9876C53A3802","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Pawan Pandoh","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"472f0889b6914293dcbc4d0f62bb3e3ce6d37ce0","datavalue":{"value":"12","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$22C57E2F-6C2C-46DC-B184-0CA7F529B6C3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Richard A Moore","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a0d6d71b9401a527331dc2a8a59c54448b5ad98c","datavalue":{"value":"13","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$C86DCED7-41A0-4653-9E9F-AEDD1BB5392C","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Yongjun Zhao","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"89d1857be00646d34838dc372e42882e3e20dca2","datavalue":{"value":"14","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$507B8D2B-1EA4-492D-93E8-3D9236BDECB7","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Andrew J Mungall","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"502af995394385a6c11fd2f00b65598853ceedc5","datavalue":{"value":"15","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$99499BC4-F219-4E8E-B79C-0FFC4AF1919F","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Barry Jaquish","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f83c26be8edcec43a735fc3c85792c85d186a3c0","datavalue":{"value":"16","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$2A452CB5-1392-48A3-8BDF-C3859ECD2CD7","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Alvin Yanchuk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a89a718f20b227073f3b4f3aa4ad0e99ba77b542","datavalue":{"value":"17","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$ED126A91-2089-4B3C-8BB6-D7FE81E05C63","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Carol Ritland","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c5201cb20b41dc2f0e2cf1361e16829d4cfbeac8","datavalue":{"value":"18","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$F64D5FE6-92D9-4818-9BB6-D162DBA85A97","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Brian Boyle","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5ffccd25ee75ecddecb8ccbb1a59226cc3ba535a","datavalue":{"value":"19","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$9D020847-DAD2-4573-8896-C6826BEBB4DD","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Jean Bousquet","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"481220fb9e6317d9e822186cb47365497d25e036","datavalue":{"value":"20","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$76CDF015-D56A-4539-9A29-ED6328566BA9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Kermit Ritland","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a39223fc722bb1c9ca54fe188d9596d0c68f055e","datavalue":{"value":"21","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$72D5B3B1-FBCD-4290-BEEE-7685B6721AA1","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"John Mackay","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"9cbb98590835f35bfb66ed07cbb2eb8d11df44f6","datavalue":{"value":"22","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$382410E5-912A-4D08-BEA6-238379D5BA61","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"J\u00f6rg Bohlmann","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"4f1ac2caf70d43bd788bfc3a341e0bb0bbfd1d74","datavalue":{"value":"23","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$AB1BF467-D7E4-484F-A9EE-C132AA0DADA3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Steven J M Jones","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"94cf58b8db10ca17aedd1fafdf9f40a82b8bdc91","datavalue":{"value":"24","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$E584D000-D3FA-48EB-B0B6-18A64D489469","rank":"normal"}],"P2860":[{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21183990,"id":"Q21183990"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$067675E1-BE45-48EC-9927-9B505DCD2C38","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22065964,"id":"Q22065964"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$B272C2D7-F0C1-4B7E-B5F0-ADBD60D235EB","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24629733,"id":"Q24629733"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$85D12800-291A-4885-8DDE-42657DE6E026","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24625559,"id":"Q24625559"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$EA35C15C-3F08-41DE-A369-06B084B6BAA3","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22122211,"id":"Q22122211"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$9F920256-4000-405C-AACB-E96C6D992603","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21183889,"id":"Q21183889"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8F12AA50-1D1B-42C6-B6AD-E9A9587F53EB","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21261967,"id":"Q21261967"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$A4899485-8489-4D70-82E7-82C216106962","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24807126,"id":"Q24807126"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$FD2F304E-61D2-41EE-8AB5-B5CA1267B7CB","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21045365,"id":"Q21045365"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$113AD736-4A2B-479D-BA9D-0615FEA01A84","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22122143,"id":"Q22122143"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$16FE34E1-5AAC-4D98-898A-7CC4699861F0","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22065842,"id":"Q22065842"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$A0BF94ED-B679-4A17-B68A-2FE7AF6858AA","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":25938991,"id":"Q25938991"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$513BAA39-8D82-4485-A25D-DB222C90B284","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27860816,"id":"Q27860816"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$DD899F96-5D71-4BBC-A87E-B710B870C6C3","rank":"normal","references":[{"hash":"8500b2f44393a196a3228b76ca7bc69e1f3f5cc1","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]}],"P1433":[{"mainsnak":{"snaktype":"value","property":"P1433","datavalue":{"value":{"entity-type":"item","numeric-id":4914910,"id":"Q4914910"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$72BB933D-4685-4F38-AE7C-1FBB71952A69","rank":"normal","references":[{"hash":"b28161529c0364292a8cfa0d6bba43b07f20a220","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":180686,"id":"Q180686"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"snaks-order":["P248"]}]}],"P3181":[{"mainsnak":{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$FDDF4A83-6970-4A50-8A59-26DFA5C2621C","rank":"normal","references":[{"hash":"dddcd22da5416e1b89c60d679e3171626efce131","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":26382154,"id":"Q26382154"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"snaks-order":["P248"]}]}],"P921":[{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":128116,"id":"Q128116"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$e8eae0f3-4581-47f5-9528-04c967854423","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":1073526,"id":"Q1073526"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$64a4a2b9-4d01-0532-bfd4-605bd9484f3c","rank":"normal"}],"P356":[{"mainsnak":{"snaktype":"value","property":"P356","datavalue":{"value":"10.1093/BIOINFORMATICS/BTT178","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$2FB0F783-8FE0-4E40-9080-7CD9DBD6906B","rank":"normal"}]},"sitelinks":[]}}}
},{}],6:[function(require,module,exports){
module.exports={"entities":{"Q27795847":{"pageid":29511090,"ns":0,"title":"Q27795847","lastrevid":453265099,"modified":"2017-02-20T20:13:32Z","type":"item","id":"Q27795847","labels":{"en":{"language":"en","value":"SPLASH, a hashed identifier for mass spectra"},"nl":{"language":"nl","value":"SPLASH, a hashed identifier for mass spectra"}},"descriptions":{"fr":{"language":"fr","value":"article scientifique (publi\u00e9 2016/11/08)"},"cs":{"language":"cs","value":"v\u011bdeck\u00fd \u010dl\u00e1nek publikovan\u00fd v roce 2016"},"nl":{"language":"nl","value":"wetenschappelijk artikel (gepubliceerd op 2016/11/08)"},"it":{"language":"it","value":"articolo scientifico (pubblicato il 2016/11/08)"},"sk":{"language":"sk","value":"vedeck\u00fd \u010dl\u00e1nok (publikovan\u00fd 2016/11/08)"},"da":{"language":"da","value":"videnskabelig artikel (udgivet  2016/11/08)"},"pt":{"language":"pt","value":"artigo cient\u00edfico (publicado na 2016/11/08)"},"en":{"language":"en","value":"scientific article"},"hy":{"language":"hy","value":"\u0563\u056b\u057f\u0561\u056f\u0561\u0576 \u0570\u0578\u0564\u057e\u0561\u056e"}},"aliases":[],"claims":{"P31":[{"mainsnak":{"snaktype":"value","property":"P31","datavalue":{"value":{"entity-type":"item","numeric-id":13442814,"id":"Q13442814"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$FE0E533D-7E2D-4FC1-AB73-22196E9D9455","rank":"normal"}],"P577":[{"mainsnak":{"snaktype":"value","property":"P577","datavalue":{"value":{"time":"+2016-11-08T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"},"type":"statement","id":"Q27795847$7695c7e8-4988-843f-d638-1a765f6bd0f1","rank":"normal"}],"P1476":[{"mainsnak":{"snaktype":"value","property":"P1476","datavalue":{"value":{"text":"SPLASH, a hashed identifier for mass spectra","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q27795847$c12e8199-4e9b-8d86-1f89-c53255e1b89f","rank":"normal"}],"P2093":[{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Gert Wohlgemuth","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"862c83ca2949d7eb8f41b4bf1a4521ed18cdebb8","datavalue":{"value":"1","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"17f7c88944bcd21a5b1de89be8babd7895377505","datavalue":{"value":{"entity-type":"item","numeric-id":129421,"id":"Q129421"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$5a37a217-4790-7488-341c-3f40aac679d5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Sajjan S Mehta","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"af1310a34ec80620d4fdd7bb8ca76e492fe6630e","datavalue":{"value":"2","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$e029413e-465a-6e7f-bbc4-7bf7d095bdf5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Ramon F Mejia","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"3c1e388cba3487113121af5bfa59a2f657bf21bd","datavalue":{"value":"3","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$459a6034-4de2-d02c-71b3-de0d009d3ca0","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Diego Pedrosa","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c8e1b85012703eb0f44ff876ec773596f3794872","datavalue":{"value":"5","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$27938ccf-4c1f-0fdc-5250-8c9b7ab1ab0c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Tom\u00e1\u0161 Pluskal","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5d30572c5a5693878a66231c29c9bb3e4a870527","datavalue":{"value":"6","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"a47de0d3aa3e3d2844ebf22e9624c4efb47ccbdd","datavalue":{"value":{"entity-type":"item","numeric-id":825987,"id":"Q825987"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$4414bb01-4540-a5d2-bb41-78cee294f865","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Michael Wilson","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ebbb7b4bd5f12eaa0eb9415b51fd725fd993a644","datavalue":{"value":"9","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$b76ba909-4412-7b4b-1b29-acc6b19a31c3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Masanori Arita","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"938c75f8b1bafb9e19a4c1a079b8b8e5d997c7fa","datavalue":{"value":"11","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"6f8ef5a2bbb33916e6b5870a7274e8730efa1f21","datavalue":{"value":{"entity-type":"item","numeric-id":1153275,"id":"Q1153275"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$f55f9709-47c0-879a-80ee-468a59ee7993","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Pieter C Dorrestein","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"472f0889b6914293dcbc4d0f62bb3e3ce6d37ce0","datavalue":{"value":"12","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$8c511a6b-4213-8d9d-ed2c-61261d710ca9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Nuno Bandeira","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a0d6d71b9401a527331dc2a8a59c54448b5ad98c","datavalue":{"value":"13","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$84869301-4041-a4b4-3496-f0f724c03ac5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Mingxun Wang","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"89d1857be00646d34838dc372e42882e3e20dca2","datavalue":{"value":"14","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"777bee7b0612da6cfca8a663b6c60ffdbed72f98","datavalue":{"value":{"entity-type":"item","numeric-id":622664,"id":"Q622664"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$d1287f99-4e2f-c26a-2257-1fa71a5f9b67","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Tobias Schulze","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"502af995394385a6c11fd2f00b65598853ceedc5","datavalue":{"value":"15","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$05d35d06-4164-b410-d163-7228c8a6bacf","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Reza M Salek","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f83c26be8edcec43a735fc3c85792c85d186a3c0","datavalue":{"value":"16","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$975616fd-41c1-5797-f792-16d317d4e17c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Venkata Chandrasekhar Nainala","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c5201cb20b41dc2f0e2cf1361e16829d4cfbeac8","datavalue":{"value":"18","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$68c00f70-40f7-52ac-6b51-27340aee5757","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Robert Mistrik","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5ffccd25ee75ecddecb8ccbb1a59226cc3ba535a","datavalue":{"value":"19","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$7e774c4a-41f4-c0c9-b0ee-391e74a772dd","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Takaaki Nishioka","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"481220fb9e6317d9e822186cb47365497d25e036","datavalue":{"value":"20","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$8d8845f3-44c5-b259-8aea-b55827411fdc","rank":"normal"}],"P478":[{"mainsnak":{"snaktype":"value","property":"P478","datavalue":{"value":"34","type":"string"},"datatype":"string"},"type":"statement","id":"Q27795847$a090a3aa-4a02-fbe5-9aca-df819f80e84c","rank":"normal"}],"P304":[{"mainsnak":{"snaktype":"value","property":"P304","datavalue":{"value":"1099\u20131101","type":"string"},"datatype":"string"},"type":"statement","id":"Q27795847$9ec79308-4361-58b7-2219-df398124c52e","rank":"normal"}],"P1433":[{"mainsnak":{"snaktype":"value","property":"P1433","datavalue":{"value":{"entity-type":"item","numeric-id":1893837,"id":"Q1893837"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b771b8e8-4ccd-82d8-02e0-df734ad9b35b","rank":"normal"}],"P921":[{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":12149006,"id":"Q12149006"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b4edba31-4e22-d1d0-60fd-8e7a4258a3a4","rank":"normal"}],"P50":[{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":5111731,"id":"Q5111731"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a89a718f20b227073f3b4f3aa4ad0e99ba77b542","datavalue":{"value":"17","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"3c814103e8488af45c5f9ddb4f3a83548284f46a","datavalue":{"value":{"entity-type":"item","numeric-id":1341845,"id":"Q1341845"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$cfda0f9e-40ab-fe07-d2c1-a646a2588c34","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":20895241,"id":"Q20895241"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c6a0d2bbafefdc6d21b25af4357c9887085c2f89","datavalue":{"value":"8","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"f3f4b1106be9c9432af1675a98182889725faf11","datavalue":{"value":{"entity-type":"item","numeric-id":19845644,"id":"Q19845644"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P1932":[{"snaktype":"value","property":"P1932","hash":"f897727ae72d779987cc1cbb9f667d3e7c74a0c2","datavalue":{"value":"Egon L Willighagen","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545","P1416","P1932"],"id":"Q27795847$4a94239d-4f1b-77a8-41b6-2c04e1f5a079","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":27863244,"id":"Q27863244"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ecdcd65e6c9f103dedc06d856ce957af15050f7b","datavalue":{"value":"7","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"2af45dffb1e796266913f5fecff0b01fb42a2142","datavalue":{"value":{"entity-type":"item","numeric-id":678765,"id":"Q678765"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$85eb14b2-4d1e-fbaa-ce18-7b92398da5d5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":27887604,"id":"Q27887604"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"6d824c4548dc9c84054b9e446b8ea72e50efebba","datavalue":{"value":"10","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"072d0bc1ba7876a9edfe9766e4dd2c83d759f3e6","datavalue":{"value":{"entity-type":"item","numeric-id":640694,"id":"Q640694"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$34c7ffad-48b7-582d-aee0-04e6694250fb","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":28540892,"id":"Q28540892"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a39223fc722bb1c9ca54fe188d9596d0c68f055e","datavalue":{"value":"21","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"17f7c88944bcd21a5b1de89be8babd7895377505","datavalue":{"value":{"entity-type":"item","numeric-id":129421,"id":"Q129421"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$990b9ecd-4746-5ebc-2209-510172d627f2","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":28541023,"id":"Q28541023"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a82b0aa3ccf1a266e15473824b4391f6d9da4be0","datavalue":{"value":"4","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$a9af48e3-4afb-4281-1b0b-7c8405afd325","rank":"normal"}],"P2860":[{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21093640,"id":"Q21093640"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$51189732-4cae-29ac-9c3d-5f52e4076684","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807487,"id":"Q27807487"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b3a68adf-4629-432a-a2fe-c5afb5d478a0","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807488,"id":"Q27807488"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$25db773a-4265-1451-58ff-d9a8d0fc2c90","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27136473,"id":"Q27136473"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$906aa8f9-4163-5c7c-c17e-7a83329babee","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807490,"id":"Q27807490"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$6a239bbf-4e74-5eb1-dd40-1bd734e00dad","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807493,"id":"Q27807493"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$a6aaa6b6-4fab-6667-4347-08af84b83958","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807494,"id":"Q27807494"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$6e77205b-4fea-719e-237e-323ffdc5de53","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807496,"id":"Q27807496"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$fd046765-4ec1-4773-dbc4-adb5a2d43490","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27809667,"id":"Q27809667"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$13ecb48e-49bf-5c2c-81a7-dcbc953f46fc","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818844,"id":"Q27818844"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$9569723d-4d9b-05ad-dfaa-f0be798cc8e4","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24595162,"id":"Q24595162"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$8a414bd4-4676-dfa6-70bf-2cc8ffdfdb9c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818909,"id":"Q27818909"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$ef170bc8-4a44-e40b-209c-9fad35846433","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818910,"id":"Q27818910"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$e101201a-4092-253b-ea90-80b52d65e153","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21030547,"id":"Q21030547"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$39288916-4bcc-bb5d-6165-a3e7d8557230","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21146620,"id":"Q21146620"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$1e9ee22e-4181-0f42-3bac-8b6bf7325ddc","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818912,"id":"Q27818912"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$15ec6ec7-4db2-3bbb-bfaf-a924b6482e51","rank":"normal"}],"P1104":[{"mainsnak":{"snaktype":"value","property":"P1104","datavalue":{"value":{"amount":"+3","unit":"1","upperBound":"+4","lowerBound":"+2"},"type":"quantity"},"datatype":"quantity"},"type":"statement","id":"Q27795847$be33113d-4b0c-7756-ecf1-ec78c0605209","rank":"normal"}],"P953":[{"mainsnak":{"snaktype":"value","property":"P953","datavalue":{"value":"http://rdcu.be/msZj","type":"string"},"datatype":"url"},"type":"statement","id":"Q27795847$9ae54b43-42bd-2c08-9347-eecb6838ae00","rank":"normal"}],"P698":[{"mainsnak":{"snaktype":"value","property":"P698","datavalue":{"value":"27824832","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q27795847$7CCFB068-30E5-4A85-A1AA-85981F7752E8","rank":"normal"}],"P356":[{"mainsnak":{"snaktype":"value","property":"P356","datavalue":{"value":"10.1038/NBT.3689","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q27795847$BDC0D3CE-51FB-4058-B1AE-BD9CF1DCB5DE","rank":"normal"}]},"sitelinks":[]}}}
},{}],7:[function(require,module,exports){
'use strict';

/* global require, describe */
describe('Cite object', require('./cite.citation.spec'));

var inputTests = require('./input.citation.spec');
describe('.async()', inputTests.async);
describe('input', inputTests.input);

describe('output', require('./output.citation.spec'));

},{"./cite.citation.spec":8,"./input.citation.spec":11,"./output.citation.spec":13}],8:[function(require,module,exports){
'use strict';

/* global require, module, describe, it */

var expect = require('expect.js');
var Cite = require('./cite');
var testInput = { csl: require('./cite.json') };

module.exports = function () {
  describe('initialisation', function () {
    it('returns a Cite object', function () {
      var test = new Cite();
      expect(test instanceof Cite).to.be(true);
    });
  });

  describe('function', function () {
    describe('add()', function () {
      var test = new Cite(testInput.csl.empty);
      test.add(testInput.csl.empty, true);

      it('works', function () {
        expect(test.data.length).to.be(2);
        expect(test.log.length).to.be(2);
      });
    });

    describe('set()', function () {
      var test = new Cite(testInput.csl.empty);
      test.set(testInput.csl.empty, true);

      it('works', function () {
        expect(test.data.length).to.be(1);
        expect(test.log.length).to.be(2);
      });
    });

    describe('reset()', function () {
      var test = new Cite(testInput.csl.empty);
      test.reset(true);

      it('works', function () {
        expect(test.data.length).to.be(0);
        expect(test.log.length).to.be(2);
      });
    });

    describe('options()', function () {
      var test = new Cite();
      test.options({ format: 'string' }, true);

      it('works', function () {
        expect(test._options.format).to.be('string');
        expect(test.log.length).to.be(2);
      });
    });

    describe('currentVersion()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.currentVersion()).to.be(1);
        test.add(testInput.csl.empty, true);
        expect(test.currentVersion()).to.be(2);
      });
    });

    describe('retrieveVersion()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).to.be(1);
        expect(test.data.length).to.be(1);

        test.add(testInput.csl.empty, true);

        expect(test.log.length).to.be(2);
        expect(test.data.length).to.be(2);

        var test2 = test.retrieveVersion(1);

        expect(test2.log.length).to.be(1);
        expect(test2.data.length).to.be(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).to.be(2);
        expect(test.data.length).to.be(2);
      });
    });

    describe('undo()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).to.be(1);
        expect(test.data.length).to.be(1);

        test.add(testInput.csl.empty, true).save();

        expect(test.log.length).to.be(3);
        expect(test.data.length).to.be(2);

        var test2 = test.undo();

        expect(test2.log.length).to.be(2);
        expect(test2.data.length).to.be(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).to.be(3);
        expect(test.data.length).to.be(2);
      });
    });

    describe('retrieveLastVersion()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).to.be(1);
        expect(test.data.length).to.be(1);

        test.add(testInput.csl.empty, true);

        expect(test.log.length).to.be(2);
        expect(test.data.length).to.be(2);

        var test2 = test.retrieveLastVersion();

        expect(test2.log.length).to.be(2);
        expect(test2.data.length).to.be(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).to.be(2);
        expect(test.data.length).to.be(2);
      });
    });

    describe('save()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).to.be(1);
        expect(test.data.length).to.be(1);

        test.save().add(testInput.csl.empty).save();

        expect(test.log.length).to.be(3);
        expect(test.data.length).to.be(2);

        var test2 = test.undo();

        expect(test2.log.length).to.be(2);
        expect(test2.data.length).to.be(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).to.be(3);
        expect(test.data.length).to.be(2);
      });
    });

    describe('sort()', function () {
      var test = new Cite(testInput.csl.sort);

      it('works', function () {
        expect(test.data[0].author[0].family).to.be('b');
        expect(test.data[1].author[0].family).to.be('a');

        test.sort();

        expect(test.data[0].author[0].family).to.be('a');
        expect(test.data[1].author[0].family).to.be('b');
      });
    });

    describe('getIds()', function () {
      var test = new Cite(testInput.csl.ids);

      it('works', function () {
        expect(test.data[0].id).to.be('b');
        expect(test.data[1].id).to.be('a');

        var out = test.getIds();

        expect(out[0]).to.be('b');
        expect(out[1]).to.be('a');
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).to.be(1);
        expect(test.data.length).to.be(2);
      });
    });
  });
};

},{"./cite":10,"./cite.json":9,"expect.js":"expect.js"}],9:[function(require,module,exports){
module.exports={
  "empty": {},
  "sort": [
    {
      "author": [
        {
          "family": "b"
        }
      ],
      "id": "b"
    },
    {
      "author": [
        {
          "family": "a"
        }
      ],
      "id": "a"
    }
  ],
  "ids": [
    {
      "id": "b"
    },
    {
      "id": "a"
    }
  ]
}
},{}],10:[function(require,module,exports){
(function (process){
'use strict';

module.exports = require(process.env.MOCHA === '1' ? '../src/index' : 'citation-js');

}).call(this,require('_process'))
},{"_process":4}],11:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global require, module, describe, it */

var expect = require('expect.js');
var Cite = require('./cite');

var test = require('./input.json');
test.input.wd.simple = require('./Q21972834.json');
test.input.wd.author = require('./Q27795847.json');

var testCaseGenerator = function testCaseGenerator(input, type, output) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$exact = _ref.exact,
      exact = _ref$exact === undefined ? false : _ref$exact,
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? function (v) {
    return v;
  } : _ref$callback,
      _ref$link = _ref.link,
      link = _ref$link === undefined ? false : _ref$link;

  return function () {
    var test = link ? Cite.parse.input.chainLink(input) : new Cite(input).data;

    it('handles input type', function () {
      expect(Cite.parse.input.type(input)).to.be(type);
    });

    it('parses input correctly', function () {
      expect(callback(test)).to[exact ? 'be' : 'eql'](output);
    });
  };
};

var wikidataTestCaseOptions = {
  exact: true,
  callback: function callback(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
        data = _ref3[0];

    return data.replace(/[&?]origin=\*/, '');
  },
  link: true
};

var doiLinkTestCaseOptions = {
  link: true
};

var doiTestCaseOptions = {
  link: true,
  callback: function callback(_ref4) {
    var title = _ref4.title;
    return title;
  }
};

module.exports = {
  async: function async() {
    describe('with callback', function () {
      it('works', function () {
        return new Promise(function (resolve) {
          Cite.async(test.input.wd.url, function (data) {
            expect(data).to.be.a(Cite);
            expect(data.data[0].wikiId).to.be(test.output.wd.id);
            resolve();
          });
        });
      });

      it('works with options', function () {
        return new Promise(function (resolve) {
          Cite.async([], {}, function (data) {
            expect(data).to.be.a(Cite);
            expect(data.data.length).to.be(0);
            resolve();
          });
        });
      });
    });

    describe('with promise', function () {
      it('works', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Cite.async(test.input.wd.url);

              case 2:
                data = _context.sent;

                expect(data).to.be.a(Cite);
                expect(data.data[0].wikiId).to.be(test.output.wd.id);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      })));

      it('works with options', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Cite.async([], {});

              case 2:
                data = _context2.sent;

                expect(data).to.be.a(Cite);
                expect(data.data.length).to.be(0);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
    });
  },
  input: function input() {
    describe('Wikidata ID', testCaseGenerator(test.input.wd.id, 'string/wikidata', test.output.wd.api[0], wikidataTestCaseOptions));

    describe('Wikidata URL', testCaseGenerator(test.input.wd.url, 'url/wikidata', test.output.wd.api[0], wikidataTestCaseOptions));

    describe('Wikidata ID list', function () {
      describe('separated by spaces', testCaseGenerator(test.input.wd.list.space, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions));

      describe('separated by newlines', testCaseGenerator(test.input.wd.list.newline, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions));

      describe('separated by commas', testCaseGenerator(test.input.wd.list.comma, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions));
    });

    describe('Wikidata JSON', function () {
      testCaseGenerator(test.input.wd.simple, 'object/wikidata', test.output.wd.simple)();

      describe('with linked authors', testCaseGenerator(test.input.wd.author, 'object/wikidata', test.output.wd.author));
    });

    describe('DOI ID', testCaseGenerator(test.input.doi.id, 'string/doi', test.output.doi.api[0], doiLinkTestCaseOptions));

    describe('DOI URL', testCaseGenerator(test.input.doi.url, 'api/doi', test.output.doi.simple.title, doiTestCaseOptions));

    describe('DOI ID list', function () {
      describe('separated by spaces', testCaseGenerator(test.input.doi.list.space, 'list/doi', test.output.doi.api[1], doiLinkTestCaseOptions));

      describe('separated by newlines', testCaseGenerator(test.input.doi.list.newline, 'list/doi', test.output.doi.api[1], doiLinkTestCaseOptions));
    });

    describe('BibTeX string', function () {
      testCaseGenerator(test.input.bibtex.simple, 'string/bibtex', test.output.bibtex.simple)();

      describe('with whitespace and unknown fields', testCaseGenerator(test.input.bibtex.whitespace, 'string/bibtex', test.output.bibtex.whitespace));
    });

    describe('BibTeX JSON', testCaseGenerator(test.input.bibtex.json, 'object/bibtex', test.output.bibtex.simple));

    describe('Bib.TXT string', function () {
      testCaseGenerator(test.input.bibtxt.simple, 'string/bibtxt', [test.output.bibtxt])();

      describe('with multiple entries', testCaseGenerator(test.input.bibtxt.multiple, 'string/bibtxt', [test.output.bibtxt, test.output.bibtex.simple[0]]));

      describe('with whitespace', testCaseGenerator(test.input.bibtxt.whitespace, 'string/bibtxt', [test.output.bibtxt]));
    });

    describe('CSL-JSON', testCaseGenerator(test.input.csl[0], 'object/csl', test.input.csl));
    describe('ContentMine JSON', testCaseGenerator(test.input.bibjson.simple, 'object/contentmine', test.output.bibjson.simple));

    describe('Array', function () {
      var objs = [{ id: 'a' }, { id: 'b' }];

      testCaseGenerator(objs, 'array/csl', objs)();
      it('duplicates objects', function () {
        expect(new Cite(objs).data).not.to.be(objs);
      });

      describe('nested', function () {
        var data = [[objs[0]], objs[1]];

        testCaseGenerator(data, 'array/else', objs)();
        it('duplicates objects', function () {
          var test = new Cite(data).data;

          expect(test[0]).not.to.be(objs[0]);
          expect(test[1]).not.to.be(objs[1]);
        });
      });
    });

    describe('Empty', function () {
      describe('string', function () {
        describe('empty', testCaseGenerator('', 'string/empty', []));
        describe('whitespace', testCaseGenerator('   \t\n \r  ', 'string/whitespace', []));
      });

      describe('null', testCaseGenerator(null, 'empty', []));
      describe('undefined', testCaseGenerator(undefined, 'empty', []));
    });
  }
};

},{"./Q21972834.json":5,"./Q27795847.json":6,"./cite":10,"./input.json":12,"expect.js":"expect.js"}],12:[function(require,module,exports){
module.exports={
  "input": {
    "wd": {
      "id": "Q21972834",
      "url": "https://www.wikidata.org/wiki/Q21972834",
      "list": {
        "space": "Q21972834 Q27795847",
        "newline": "Q21972834\nQ27795847",
        "comma": "Q21972834,Q27795847"
      }
    },
    "doi": {
      "id": "10.1021/ja01577a030",
      "url": "https://doi.org/10.1021/ja01577a030",
      "list": {
        "space": "10.1021/ja01577a030 10.1021/ci025584y",
        "newline": "10.1021/ja01577a030\n10.1021/ci025584y"
      }
    },
    "bibtex": {
      "simple": "@article{Steinbeck2003, author = {Steinbeck, Christoph and Han, Yongquan and Kuhn, Stefan and Horlacher, Oliver and Luttmann, Edgar and Willighagen, Egon}, year = {2003}, title = {{The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.}}, journal = {Journal of chemical information and computer sciences}, volume = {43}, number = {2}, pages = {493--500}, doi = {10.1021/ci025584y}, isbn = {2214707786}, issn = {0095-2338}, pmid = {12653513}, url = {http://www.ncbi.nlm.nih.gov/pubmed/12653513} }",
      "whitespace": "@inproceedings{Ekstrand:2009:RYD,\n author = {Michael D. Ekstrand and John T. Riedl},\n title = {rv you're dumb: Identifying Discarded Work in Wiki Article History},\n booktitle = {Proceedings of the 5th International Symposium on Wikis and Open Collaboration},\n series = {WikiSym '09},\n year = {2009},\n isbn = {978-1-60558-730-1},\n location = {Orlando, Florida},\n pages = {4:1--4:10},\n articleno = {4},\n numpages = {10},\n url = {https://dx.doi.org/10.1145/1641309.1641317},\n doi = {10.1145/1641309.1641317},\n acmid = {1641317},\n publisher = {ACM},\n address = {New York, NY, USA},\n keywords = {Wiki, Wikipedia, article history, visualization},\n}\n",
      "json": {
        "type": "article",
        "label": "Steinbeck2003",
        "properties": {
          "author": "Christoph Steinbeck and Yongquan Han and Stefan Kuhn and Oliver Horlacher and Edgar Luttmann and Egon Willighagen",
          "doi": "10.1021/ci025584y",
          "isbn": "2214707786",
          "issn": "0095-2338",
          "journal": "Journal of chemical information and computer sciences",
          "issue": "2",
          "pages": "493-500",
          "title": "The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics",
          "volume": "43",
          "year": "2003",
          "url": "http://www.ncbi.nlm.nih.gov/pubmed/12653513"
        }
      }
    },
    "bibtxt": {
      "simple": "[Fau86]\n    author:    J.W. Goethe\n    title:     Faust. Der Tragödie Erster Teil\n    publisher: Reclam\n    year:      1986\n    address:   Stuttgart",
      "multiple": "[Fau86]\n    author:    J.W. Goethe\n    title:     Faust. Der Tragödie Erster Teil\n    publisher: Reclam\n    year:      1986\n    address:   Stuttgart\n\n  [Steinbeck2003]\n    type: article\n    author: Christoph Steinbeck and Yongquan Han and Stefan Kuhn and Oliver Horlacher and Edgar Luttmann and Egon Willighagen\n    doi: 10.1021/ci025584y\n    isbn: 2214707786\n    issn: 0095-2338\n    journal: Journal of chemical information and computer sciences\n    issue: 2\n    pages: 493-500\n    title: The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics\n    volume: 43\n    year: 2003\n    url: http://www.ncbi.nlm.nih.gov/pubmed/12653513",
      "whitespace": "[Fau86]  \n      \n    author:    J.W. Goethe\n    title:     Faust. Der Tragödie Erster Teil\n    \n\n    publisher: Reclam\n    year:      1986  \n    address:   Stuttgart\n  "
    },
    "bibjson": {
      "simple": {
        "publisher": {
          "value": [
            "BioMed Central"
          ]
        },
        "journal": {
          "value": [
            "Journal of Ethnobiology and Ethnomedicine"
          ]
        },
        "title": {
          "value": [
            "Gitksan medicinal plants-cultural choice and efficacy"
          ]
        },
        "authors": {
          "value": [
            "Leslie Main Johnson"
          ]
        },
        "date": {
          "value": [
            "2006-06-21"
          ]
        },
        "doi": {
          "value": [
            "10.1186/1746-4269-2-29"
          ]
        },
        "volume": {
          "value": [
            "2"
          ]
        },
        "issue": {
          "value": [
            "1"
          ]
        },
        "firstpage": {
          "value": [
            "1"
          ]
        },
        "fulltext_html": {
          "value": [
            "http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29"
          ]
        },
        "fulltext_pdf": {
          "value": [
            "http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com"
          ]
        },
        "license": {
          "value": [
            "This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited."
          ]
        },
        "copyright": {
          "value": [
            "2006 Johnson; licensee BioMed Central Ltd."
          ]
        }
      }
    },
    "csl": [
      {
        "id": "Q23571040",
        "type": "article-journal",
        "title": "Correlation of the Base Strengths of Amines 1",
        "DOI": "10.1021/ja01577a030",
        "author": [
          {
            "given": "H. K.",
            "family": "Hall"
          }
        ],
        "issued": [
          {
            "date-parts": [
              "1957",
              "1",
              "1"
            ]
          }
        ],
        "container-title": "Journal of the American Chemical Society",
        "volume": "79",
        "issue": "20",
        "page": "5441-5444"
      }
    ]
  },
  "output": {
    "wd": {
      "id": "Q21972834",
      "simple": [
        {
          "wikiId": "Q21972834",
          "id": "Q21972834",
          "type": "article-journal",
          "title": "Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data",
          "volume": "29",
          "issue": "12",
          "issued": {
            "date-parts": [[
              2013,
              6,
              15
            ]]
          },
          "page": "1492-7",
          "container-title": "Bioinformatics",
          "DOI": "10.1093/BIOINFORMATICS/BTT178",
          "author": [
            {
              "given": "Inanc",
              "family": "Birol"
            },
            {
              "given": "Anthony",
              "family": "Raymond"
            },
            {
              "given": "Shaun D",
              "family": "Jackman"
            },
            {
              "given": "Stephen",
              "family": "Pleasance"
            },
            {
              "given": "Robin",
              "family": "Coope"
            },
            {
              "given": "Greg A",
              "family": "Taylor"
            },
            {
              "given": "Macaire Man Saint",
              "family": "Yuen"
            },
            {
              "given": "Christopher I",
              "family": "Keeling"
            },
            {
              "given": "Dana",
              "family": "Brand"
            },
            {
              "given": "Benjamin P",
              "family": "Vandervalk"
            },
            {
              "given": "Heather",
              "family": "Kirk"
            },
            {
              "given": "Pawan",
              "family": "Pandoh"
            },
            {
              "given": "Richard A",
              "family": "Moore"
            },
            {
              "given": "Yongjun",
              "family": "Zhao"
            },
            {
              "given": "Andrew J",
              "family": "Mungall"
            },
            {
              "given": "Barry",
              "family": "Jaquish"
            },
            {
              "given": "Alvin",
              "family": "Yanchuk"
            },
            {
              "given": "Carol",
              "family": "Ritland"
            },
            {
              "given": "Brian",
              "family": "Boyle"
            },
            {
              "given": "Jean",
              "family": "Bousquet"
            },
            {
              "given": "Kermit",
              "family": "Ritland"
            },
            {
              "given": "John",
              "family": "Mackay"
            },
            {
              "given": "Jörg",
              "family": "Bohlmann"
            },
            {
              "given": "Steven J M",
              "family": "Jones"
            }
          ]
        }
      ],
      "author": [
        {
          "wikiId": "Q27795847",
          "id": "Q27795847",
          "type": "article-journal",
          "issued": {
            "date-parts": [[
              2016,
              11,
              8
            ]]
          },
          "title": "SPLASH, a hashed identifier for mass spectra",
          "volume": "34",
          "page": "1099–1101",
          "container-title": "Nature Biotechnology",
          "URL": "http://rdcu.be/msZj",
          "DOI": "10.1038/NBT.3689",
          "author": [
            {
              "given": "Gert",
              "family": "Wohlgemuth"
            },
            {
              "given": "Sajjan S",
              "family": "Mehta"
            },
            {
              "given": "Ramon F",
              "family": "Mejia"
            },
            {
              "given": "Steffen",
              "family": "Neumann"
            },
            {
              "given": "Diego",
              "family": "Pedrosa"
            },
            {
              "given": "Tomáš",
              "family": "Pluskal"
            },
            {
              "given": "Emma",
              "family": "Schymanski"
            },
            {
              "given": "Egon",
              "family": "Willighagen"
            },
            {
              "given": "Michael",
              "family": "Wilson"
            },
            {
              "given": "David S",
              "family": "Wishart"
            },
            {
              "given": "Masanori",
              "family": "Arita"
            },
            {
              "given": "Pieter C",
              "family": "Dorrestein"
            },
            {
              "given": "Nuno",
              "family": "Bandeira"
            },
            {
              "given": "Mingxun",
              "family": "Wang"
            },
            {
              "given": "Tobias",
              "family": "Schulze"
            },
            {
              "given": "Reza M",
              "family": "Salek"
            },
            {
              "given": "Christoph",
              "family": "Steinbeck"
            },
            {
              "given": "Venkata Chandrasekhar",
              "family": "Nainala"
            },
            {
              "given": "Robert",
              "family": "Mistrik"
            },
            {
              "given": "Takaaki",
              "family": "Nishioka"
            },
            {
              "given": "Oliver",
              "family": "Fiehn"
            }
          ]
        }
      ],
      "api": [
        "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q21972834&format=json&languages=en",
        "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q21972834%7CQ27795847&format=json&languages=en"
      ]
    },
    "doi": {
      "simple": [{"indexed":{"date-parts":[[2017,5,10]],"date-time":"2017-05-10T11:14:56Z","timestamp":1494414896320},"reference-count":0,"publisher":"American Chemical Society (ACS)","issue":"20","content-domain":{"domain":[],"crossmark-restriction":false},"short-container-title":["J. Am. Chem. Soc."],"published-print":{"date-parts":[[1957,10]]},"DOI":"10.1021\/ja01577a030","type":"journal-article","created":{"date-parts":[[2005,3,10]],"date-time":"2005-03-10T14:51:56Z","timestamp":1110466316000},"page":"5441-5444","source":"Crossref","is-referenced-by-count":0,"title":"Correlation of the Base Strengths of Amines1","prefix":"10.1021","volume":"79","author":[{"suffix":"Jr.","given":"H. K.","family":"Hall","affiliation":[]}],"member":"316","container-title":"Journal of the American Chemical Society","original-title":[],"deposited":{"date-parts":[[2016,9,7]],"date-time":"2016-09-07T14:19:33Z","timestamp":1473257973000},"score":1.0,"subtitle":[],"short-title":[],"issued":{"date-parts":[[1957,10]]},"references-count":0,"alternative-id":["10.1021\/ja01577a030"],"URL":"http:\/\/dx.doi.org\/10.1021\/ja01577a030","relation":{},"ISSN":["0002-7863","1520-5126"],"issn-type":[{"value":"0002-7863","type":"print"},{"value":"1520-5126","type":"electronic"}],"subject":["Colloid and Surface Chemistry","Biochemistry","Chemistry(all)","Catalysis"]}],
      "api": [
        ["https://doi.org/10.1021/ja01577a030"],
        ["https://doi.org/10.1021/ja01577a030", "https://doi.org/10.1021/ci025584y"]
      ]
    },
    "bibtex": {
      "simple": [
        {
          "label": "Steinbeck2003",
          "type": "article-journal",
          "author": [
            {
              "given": "Christoph",
              "family": "Steinbeck"
            },
            {
              "given": "Yongquan",
              "family": "Han"
            },
            {
              "given": "Stefan",
              "family": "Kuhn"
            },
            {
              "given": "Oliver",
              "family": "Horlacher"
            },
            {
              "given": "Edgar",
              "family": "Luttmann"
            },
            {
              "given": "Egon",
              "family": "Willighagen"
            }
          ],
          "year": "2003",
          "title": "The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics",
          "container-title": "Journal of chemical information and computer sciences",
          "volume": "43",
          "issue": "2",
          "page": "493-500",
          "DOI": "10.1021/ci025584y",
          "ISBN": "2214707786",
          "ISSN": "0095-2338",
          "URL": "http://www.ncbi.nlm.nih.gov/pubmed/12653513",
          "id": "Steinbeck2003"
        }
      ],
      "whitespace": [
        {
          "label": "Ekstrand:2009:RYD",
          "type": "paper-conference",
          "author": [
            {
              "given": "Michael D.",
              "family": "Ekstrand"
            },
            {
              "given": "John T.",
              "family": "Riedl"
            }
          ],
          "title": "rv you're dumb: Identifying Discarded Work in Wiki Article History",
          "container-title": "Proceedings of the 5th International Symposium on Wikis and Open Collaboration",
          "collection-title": "WikiSym '09",
          "year": "2009",
          "ISBN": "978-1-60558-730-1",
          "publisher-place": "New York, NY, USA",
          "page": "4:1-4:10",
          "URL": "https://dx.doi.org/10.1145/1641309.1641317",
          "DOI": "10.1145/1641309.1641317",
          "publisher": "ACM",
          "id": "Ekstrand:2009:RYD"
        }
      ]
    },
    "bibtxt": {
      "author": [
        {
          "given": "J.W.",
          "family": "Goethe"
        }
      ],
      "title": "Faust. Der Tragödie Erster Teil",
      "publisher": "Reclam",
      "year": "1986",
      "publisher-place": "Stuttgart",
      "type": "book",
      "id": "Fau86",
      "label": "Fau86"
    },
    "bibjson": {
      "simple": [
        {
          "publisher": "BioMed Central",
          "journal": "Journal of Ethnobiology and Ethnomedicine",
          "title": "Gitksan medicinal plants-cultural choice and efficacy",
          "authors": "Leslie Main Johnson",
          "date": "2006-06-21",
          "doi": "10.1186/1746-4269-2-29",
          "volume": "2",
          "issue": "1",
          "firstpage": "1",
          "fulltext_html": "http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29",
          "fulltext_pdf": "http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com",
          "license": "This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.",
          "copyright": "2006 Johnson; licensee BioMed Central Ltd.",
          "type": "article-journal",
          "author": [
            {
              "given": "Leslie Main",
              "family": "Johnson"
            }
          ],
          "page-first": "1",
          "page": "1",
          "issued": {
            "date-parts": [[
              2006,
              6,
              21
            ]]
          },
          "container-title": "Journal of Ethnobiology and Ethnomedicine",
          "id": "10.1186/1746-4269-2-29",
          "DOI": "10.1186/1746-4269-2-29"
        }
      ]
    }
  }
}
},{}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global require, module, describe, it */

var expect = require('expect.js');
var Cite = require('./cite');
var test = require('./output.json');

var customTemplate = '<?xml version="1.0" encoding="utf-8"?>\n<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">\n  <bibliography>\n    <layout>\n      <text variable="title"/>\n    </layout>\n  </bibliography>\n</style>';
var customLocale = '<?xml version="1.0" encoding="utf-8"?>\n<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="custom">\n  <style-options punctuation-in-quote="true"/>\n  <date form="text">\n    <date-part name="month" suffix=" "/>\n    <date-part name="day" suffix=", "/>\n    <date-part name="year"/>\n  </date>\n  <date form="numeric">\n    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>\n    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>\n    <date-part name="year"/>\n  </date>\n  <terms>\n    <term name="no date" form="short">custom</term>\n  </terms>\n</locale>';

var testCaseGenerator = function testCaseGenerator(data, options, output) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? function (v) {
    return v;
  } : _ref$callback,
      _ref$msg = _ref.msg,
      msg = _ref$msg === undefined ? 'outputs correctly' : _ref$msg;

  return function () {
    var out = callback(data.get(options));
    out = typeof out === 'string' ? out.trim() : out;

    it(msg, function () {
      expect(out).to[(typeof out === 'undefined' ? 'undefined' : _typeof(out)) === 'object' ? 'eql' : 'be'](output);
    });
  };
};

module.exports = function () {
  var data = new Cite(test.input.csl.simple);

  describe('formatted CSL', function () {
    describe('html', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, {
        format: 'string',
        type: 'html',
        style: 'citation-apa'
      }, test.output.csl.html.apa));

      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, {
        format: 'string',
        type: 'html',
        style: 'citation-vancouver'
      }, test.output.csl.html.vancouver));

      describe('custom template', function () {
        var reg = Cite.CSL.register;
        reg.addTemplate('custom', customTemplate);

        it('registers the template', function () {
          expect(reg.hasTemplate('custom')).to.be(true);
          expect(reg.getTemplate('custom')).to.be(customTemplate);
        });

        testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-custom'
        }, test.output.csl.html.title, { msg: 'uses the template' })();
      });

      describe('custom locale', function () {
        var reg = Cite.CSL.register;
        reg.addLocale('custom', customLocale);

        it('registers the locale', function () {
          expect(reg.hasLocale('custom')).to.be(true);
          expect(reg.getLocale('custom')).to.be(customLocale);
        });

        testCaseGenerator(new Cite({ id: 'a', type: 'article-journal' }), {
          format: 'string',
          type: 'html',
          style: 'citation-apa',
          lang: 'custom'
        }, test.output.csl.html.locale, { msg: 'uses the locale' })();
      });
    });

    describe('plain text', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, {
        format: 'string',
        type: 'string',
        style: 'citation-apa'
      }, test.output.csl.apa));

      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, {
        format: 'string',
        type: 'string',
        style: 'citation-vancouver'
      }, test.output.csl.vancouver));

      describe('custom template', function () {
        var reg = Cite.CSL.register;
        reg.addTemplate('custom', customTemplate);

        it('registers the template', function () {
          expect(reg.hasTemplate('custom')).to.be(true);
          expect(reg.getTemplate('custom')).to.be(customTemplate);
        });

        testCaseGenerator(data, {
          format: 'string',
          type: 'string',
          style: 'citation-custom'
        }, test.output.csl.title, { msg: 'uses the template' })();
      });

      describe('custom locale', function () {
        var reg = Cite.CSL.register;
        reg.addLocale('custom', customLocale);

        it('registers the locale', function () {
          expect(reg.hasLocale('custom')).to.be(true);
          expect(reg.getLocale('custom')).to.be(customLocale);
        });

        testCaseGenerator(new Cite({ id: 'a', type: 'article-journal' }), {
          format: 'string',
          type: 'string',
          style: 'citation-apa',
          lang: 'custom'
        }, '(custom).', { msg: 'uses the locale' })();
      });
    });
  });

  describe('CSL-JSON', function () {
    describe('plain text', testCaseGenerator(data, { format: 'string' }, test.input.csl.simple, { callback: JSON.parse }));
    describe('object', testCaseGenerator(data, undefined, test.input.csl.simple));
  });

  describe('BibTeX', function () {
    describe('plain text', testCaseGenerator(data, {
      format: 'string',
      type: 'string',
      style: 'bibtex'
    }, test.output.bibtex.plain, { callback: function callback(v) {
        return v.replace(/\s+/g, ' ');
      } }));

    describe('JSON', testCaseGenerator(data, { style: 'bibtex' }, test.output.bibtex.json));

    describe('Bib.TXT', testCaseGenerator(data, {
      format: 'string',
      type: 'string',
      style: 'bibtxt'
    }, test.output.bibtex.bibtxt));
  });
};

},{"./cite":10,"./output.json":14,"expect.js":"expect.js"}],14:[function(require,module,exports){
module.exports={
  "input": {
    "csl": {
      "simple": [
        {
          "id": "Q23571040",
          "type": "article-journal",
          "title": "Correlation of the Base Strengths of Amines 1",
          "DOI": "10.1021/ja01577a030",
          "author": [
            {
              "given": "H. K.",
              "family": "Hall"
            }
          ],
          "issued": {"date-parts": [[1957, 1, 1]]},
          "container-title": "Journal of the American Chemical Society",
          "volume": "79",
          "issue": "20",
          "page": "5441-5444"
        }
      ]
    }
  },
  "output": {
    "csl": {
      "apa": "Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society, 79(20), 5441–5444. https://doi.org/10.1021/ja01577a030",
      "vancouver": "1. Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 1957 Jan 1;79(20):5441–4.",
      "title": "Correlation of the Base Strengths of Amines 1",
      "html": {
        "apa": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. <i>Journal of the American Chemical Society</i>, <i>79</i>(20), 5441–5444. https://doi.org/10.1021/ja01577a030</div>\n</div>",
        "vancouver": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">\n    <div class=\"csl-left-margin\">1. </div><div class=\"csl-right-inline\">Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 1957 Jan 1;79(20):5441–4.</div>\n   </div>\n</div>",
        "title": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">Correlation of the Base Strengths of Amines 1</div>\n</div>",
        "locale": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"a\" class=\"csl-entry\"> (custom).</div>\n</div>"
      }
    },
    "bibtex": {
      "plain": "@article{Hall1957Correlation, author={H. K. Hall}, doi={10.1021/ja01577a030}, journal={Journal of the American Chemical Society}, issue=20, pages={5441--5444}, title={{Correlation of the Base Strengths of Amines 1}}, volume=79, year=1957, }",
      "json": [
        {
          "label": "Hall1957Correlation",
          "type": "article",
          "properties": {
            "author": "H. K. Hall",
            "doi": "10.1021/ja01577a030",
            "journal": "Journal of the American Chemical Society",
            "issue": "20",
            "pages": "5441--5444",
            "title": "Correlation of the Base Strengths of Amines 1",
            "volume": "79",
            "year": "1957"
          }
        }
      ],
      "bibtxt": "[Hall1957Correlation]\n\ttype: article\n\tauthor: H. K. Hall\n\tdoi: 10.1021/ja01577a030\n\tjournal: Journal of the American Chemical Society\n\tissue: 20\n\tpages: 5441--5444\n\ttitle: Correlation of the Base Strengths of Amines 1\n\tvolume: 79\n\tyear: 1957"
    }
  }
}
},{}]},{},[7]);
