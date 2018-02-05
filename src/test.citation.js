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

  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);
  arr = new Arr(len * 3 / 4 - placeHolders);
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
  var extraBytes = len % 3;
  var output = '';
  var parts = [];
  var maxChunkLength = 16383;

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

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
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
'use strict';

var base64 = require('base64-js');

var ieee754 = require('ieee754');

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
  console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = {
      __proto__: Uint8Array.prototype,
      foo: function foo() {
        return 42;
      }
    };
    return arr.foo() === 42;
  } catch (e) {
    return false;
  }
}

function createBuffer(length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length');
  }

  var buf = new Uint8Array(length);
  buf.__proto__ = Buffer.prototype;
  return buf;
}

function Buffer(arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }

    return allocUnsafe(arg);
  }

  return from(arg, encodingOrOffset, length);
}

if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  });
}

Buffer.poolSize = 8192;

function from(value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset);
  }

  return fromObject(value);
}

Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length);
};

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
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
  }

  return createBuffer(size);
}

Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding);
};

function allocUnsafe(size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0);
}

Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size);
};

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
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
  }

  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
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

  if (isArrayBufferView(string) || isArrayBuffer(string)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;
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
        if (loweredCase) return utf8ToBytes(string).length;
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  if (start === undefined || start < 0) {
    start = 0;
  }

  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

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

function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0) return -1;

  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }

  byteOffset = +byteOffset;

  if (numberIsNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  if (Buffer.isBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }

    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF;

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
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
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
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;

  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }

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
  newBuf.__proto__ = Buffer.prototype;
  return newBuf;
};

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

Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');
  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000) {
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

Buffer.prototype.fill = function fill(val, start, end, encoding) {
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

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean(str) {
  str = str.trim().replace(INVALID_BASE64_RE, '');
  if (str.length < 2) return '';

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

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      if (!leadSurrogate) {
        if (codePoint > 0xDBFF) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        leadSurrogate = codePoint;
        continue;
      }

      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

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

function isArrayBuffer(obj) {
  return obj instanceof ArrayBuffer || obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' && typeof obj.byteLength === 'number';
}

function isArrayBufferView(obj) {
  return typeof ArrayBuffer.isView === 'function' && ArrayBuffer.isView(obj);
}

function numberIsNaN(obj) {
  return obj !== obj;
}

},{"base64-js":1,"ieee754":4}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Response = function () {
  function Response(statusCode, headers, body, url) {
    if (typeof statusCode !== 'number') {
      throw new TypeError('statusCode must be a number but was ' + _typeof(statusCode));
    }

    if (headers === null) {
      throw new TypeError('headers cannot be null');
    }

    if (_typeof(headers) !== 'object') {
      throw new TypeError('headers must be an object but was ' + _typeof(headers));
    }

    this.statusCode = statusCode;
    var headersToLowerCase = {};

    for (var key in headers) {
      headersToLowerCase[key.toLowerCase()] = headers[key];
    }

    this.headers = headersToLowerCase;
    this.body = body;
    this.url = url;
  }

  Response.prototype.isError = function () {
    return this.statusCode === 0 || this.statusCode >= 400;
  };

  Response.prototype.getBody = function (encoding) {
    if (this.statusCode === 0) {
      var err = new Error('This request to ' + this.url + ' resulted in a status code of 0. This usually indicates some kind of network error in a browser (e.g. CORS not being set up or the DNS failing to resolve):\n' + this.body.toString());
      err.statusCode = this.statusCode;
      err.headers = this.headers;
      err.body = this.body;
      err.url = this.url;
      throw err;
    }

    if (this.statusCode >= 300) {
      var err = new Error('Server responded to ' + this.url + ' with status code ' + this.statusCode + ':\n' + this.body.toString());
      err.statusCode = this.statusCode;
      err.headers = this.headers;
      err.body = this.body;
      err.url = this.url;
      throw err;
    }

    if (!encoding || typeof this.body === 'string') {
      return this.body;
    }

    return this.body.toString(encoding);
  };

  return Response;
}();

module.exports = Response;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.__esModule = true;

var handle_qs_js_1 = require("then-request/lib/handle-qs.js");

var GenericResponse = require("http-response-object");

var fd = FormData;
exports.FormData = fd;

function doRequest(method, url, options) {
  var xhr = new XMLHttpRequest();

  if (typeof method !== 'string') {
    throw new TypeError('The method must be a string.');
  }

  if (url && _typeof(url) === 'object') {
    url = url.href;
  }

  if (typeof url !== 'string') {
    throw new TypeError('The URL/path must be a string.');
  }

  if (options === null || options === undefined) {
    options = {};
  }

  if (_typeof(options) !== 'object') {
    throw new TypeError('Options must be an object (or null).');
  }

  method = method.toUpperCase();
  options.headers = options.headers || {};
  var match;
  var crossDomain = !!((match = /^([\w-]+:)?\/\/([^\/]+)/.exec(url)) && match[2] != location.host);
  if (!crossDomain) options.headers['X-Requested-With'] = 'XMLHttpRequest';

  if (options.qs) {
    url = handle_qs_js_1["default"](url, options.qs);
  }

  if (options.json) {
    options.body = JSON.stringify(options.json);
    options.headers['content-type'] = 'application/json';
  }

  if (options.form) {
    options.body = options.form;
  }

  xhr.open(method, url, false);

  for (var name in options.headers) {
    xhr.setRequestHeader(name.toLowerCase(), '' + options.headers[name]);
  }

  xhr.send(options.body ? options.body : null);
  var headers = {};
  xhr.getAllResponseHeaders().split('\r\n').forEach(function (header) {
    var h = header.split(':');

    if (h.length > 1) {
      headers[h[0].toLowerCase()] = h.slice(1).join(':').trim();
    }
  });
  return new GenericResponse(xhr.status, headers, xhr.responseText, url);
}

exports["default"] = doRequest;
module.exports = doRequest;
module.exports["default"] = doRequest;
module.exports.FormData = fd;

},{"http-response-object":3,"then-request/lib/handle-qs.js":6}],6:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var qs_1 = require("qs");

function handleQs(url, query) {
  var _a = url.split('?'),
      start = _a[0],
      part2 = _a[1];

  var qs = (part2 || '').split('#')[0];
  var end = part2 && part2.split('#').length > 1 ? '#' + part2.split('#')[1] : '';
  var baseQs = qs_1.parse(qs);

  for (var i in query) {
    baseQs[i] = query[i];
  }

  qs = qs_1.stringify(baseQs);

  if (qs !== '') {
    qs = '?' + qs;
  }

  return start + qs + end;
}

exports["default"] = handleQs;

},{"qs":8}],7:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;
module.exports = {
  'default': 'RFC3986',
  formatters: {
    RFC1738: function RFC1738(value) {
      return replace.call(value, percentTwenties, '+');
    },
    RFC3986: function RFC3986(value) {
      return value;
    }
  },
  RFC1738: 'RFC1738',
  RFC3986: 'RFC3986'
};

},{}],8:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');

var parse = require('./parse');

var formats = require('./formats');

module.exports = {
  formats: formats,
  parse: parse,
  stringify: stringify
};

},{"./formats":7,"./parse":9,"./stringify":10}],9:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  arrayLimit: 20,
  decoder: utils.decode,
  delimiter: '&',
  depth: 5,
  parameterLimit: 1000,
  plainObjects: false,
  strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
  var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);

  for (var i = 0; i < parts.length; ++i) {
    var part = parts[i];
    var bracketEqualsPos = part.indexOf(']=');
    var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;
    var key, val;

    if (pos === -1) {
      key = options.decoder(part, defaults.decoder);
      val = options.strictNullHandling ? null : '';
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder);
      val = options.decoder(part.slice(pos + 1), defaults.decoder);
    }

    if (has.call(obj, key)) {
      obj[key] = [].concat(obj[key]).concat(val);
    } else {
      obj[key] = val;
    }
  }

  return obj;
};

var parseObject = function parseObject(chain, val, options) {
  var leaf = val;

  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];

    if (root === '[]') {
      obj = [];
      obj = obj.concat(leaf);
    } else {
      obj = options.plainObjects ? Object.create(null) : {};
      var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);

      if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
        obj = [];
        obj[index] = leaf;
      } else {
        obj[cleanRoot] = leaf;
      }
    }

    leaf = obj;
  }

  return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
  if (!givenKey) {
    return;
  }

  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;
  var brackets = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;
  var segment = brackets.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;
  var keys = [];

  if (parent) {
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }

    keys.push(parent);
  }

  var i = 0;

  while ((segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;

    if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }

    keys.push(segment[1]);
  }

  if (segment) {
    keys.push('[' + key.slice(segment.index) + ']');
  }

  return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
  var options = opts ? utils.assign({}, opts) : {};

  if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
    throw new TypeError('Decoder has to be a function.');
  }

  options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
  options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
  options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
  options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
  options.parseArrays = options.parseArrays !== false;
  options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
  options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
  options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
  options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
  options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
  options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

  if (str === '' || str === null || typeof str === 'undefined') {
    return options.plainObjects ? Object.create(null) : {};
  }

  var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
  var obj = options.plainObjects ? Object.create(null) : {};
  var keys = Object.keys(tempObj);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options);
    obj = utils.merge(obj, newObj, options);
  }

  return utils.compact(obj);
};

},{"./utils":11}],10:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var utils = require('./utils');

var formats = require('./formats');

var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + '[]';
  },
  indices: function indices(prefix, key) {
    return prefix + '[' + key + ']';
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var toISO = Date.prototype.toISOString;
var defaults = {
  delimiter: '&',
  encode: true,
  encoder: utils.encode,
  encodeValuesOnly: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};

var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly) {
  var obj = object;

  if (typeof filter === 'function') {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate(obj);
  } else if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
    }

    obj = '';
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
      return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
    }

    return [formatter(prefix) + '=' + formatter(String(obj))];
  }

  var values = [];

  if (typeof obj === 'undefined') {
    return values;
  }

  var objKeys;

  if (Array.isArray(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }

  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];

    if (skipNulls && obj[key] === null) {
      continue;
    }

    if (Array.isArray(obj)) {
      values = values.concat(stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
    } else {
      values = values.concat(stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
    }
  }

  return values;
};

module.exports = function (object, opts) {
  var obj = object;
  var options = opts ? utils.assign({}, opts) : {};

  if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
    throw new TypeError('Encoder has to be a function.');
  }

  var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
  var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
  var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
  var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
  var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
  var sort = typeof options.sort === 'function' ? options.sort : null;
  var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
  var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
  var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;

  if (typeof options.format === 'undefined') {
    options.format = formats['default'];
  } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
    throw new TypeError('Unknown format option provided.');
  }

  var formatter = formats.formatters[options.format];
  var objKeys;
  var filter;

  if (typeof options.filter === 'function') {
    filter = options.filter;
    obj = filter('', obj);
  } else if (Array.isArray(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }

  var keys = [];

  if (_typeof(obj) !== 'object' || obj === null) {
    return '';
  }

  var arrayFormat;

  if (options.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = options.arrayFormat;
  } else if ('indices' in options) {
    arrayFormat = options.indices ? 'indices' : 'repeat';
  } else {
    arrayFormat = 'indices';
  }

  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

  if (!objKeys) {
    objKeys = Object.keys(obj);
  }

  if (sort) {
    objKeys.sort(sort);
  }

  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];

    if (skipNulls && obj[key] === null) {
      continue;
    }

    keys = keys.concat(stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encode ? encoder : null, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
  }

  var joined = keys.join(delimiter);
  var prefix = options.addQueryPrefix === true ? '?' : '';
  return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":7,"./utils":11}],11:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var has = Object.prototype.hasOwnProperty;

var hexTable = function () {
  var array = [];

  for (var i = 0; i < 256; ++i) {
    array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
  }

  return array;
}();

var compactQueue = function compactQueue(queue) {
  var obj;

  while (queue.length) {
    var item = queue.pop();
    obj = item.obj[item.prop];

    if (Array.isArray(obj)) {
      var compacted = [];

      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== 'undefined') {
          compacted.push(obj[j]);
        }
      }

      item.obj[item.prop] = compacted;
    }
  }

  return obj;
};

exports.arrayToObject = function arrayToObject(source, options) {
  var obj = options && options.plainObjects ? Object.create(null) : {};

  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== 'undefined') {
      obj[i] = source[i];
    }
  }

  return obj;
};

exports.merge = function merge(target, source, options) {
  if (!source) {
    return target;
  }

  if (_typeof(source) !== 'object') {
    if (Array.isArray(target)) {
      target.push(source);
    } else if (_typeof(target) === 'object') {
      if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }

    return target;
  }

  if (_typeof(target) !== 'object') {
    return [target].concat(source);
  }

  var mergeTarget = target;

  if (Array.isArray(target) && !Array.isArray(source)) {
    mergeTarget = exports.arrayToObject(target, options);
  }

  if (Array.isArray(target) && Array.isArray(source)) {
    source.forEach(function (item, i) {
      if (has.call(target, i)) {
        if (target[i] && _typeof(target[i]) === 'object') {
          target[i] = exports.merge(target[i], item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }

  return Object.keys(source).reduce(function (acc, key) {
    var value = source[key];

    if (has.call(acc, key)) {
      acc[key] = exports.merge(acc[key], value, options);
    } else {
      acc[key] = value;
    }

    return acc;
  }, mergeTarget);
};

exports.assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};

exports.decode = function (str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (e) {
    return str;
  }
};

exports.encode = function encode(str) {
  if (str.length === 0) {
    return str;
  }

  var string = typeof str === 'string' ? str : String(str);
  var out = '';

  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);

    if (c === 0x2D || c === 0x2E || c === 0x5F || c === 0x7E || c >= 0x30 && c <= 0x39 || c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A) {
        out += string.charAt(i);
        continue;
      }

    if (c < 0x80) {
      out = out + hexTable[c];
      continue;
    }

    if (c < 0x800) {
      out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
      continue;
    }

    if (c < 0xD800 || c >= 0xE000) {
      out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
      continue;
    }

    i += 1;
    c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
    out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
  }

  return out;
};

exports.compact = function compact(value) {
  var queue = [{
    obj: {
      o: value
    },
    prop: 'o'
  }];
  var refs = [];

  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);

    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];

      if (_typeof(val) === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({
          obj: obj,
          prop: key
        });
        refs.push(val);
      }
    }
  }

  return compactQueue(queue);
};

exports.isRegExp = function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function isBuffer(obj) {
  if (obj === null || typeof obj === 'undefined') {
    return false;
  }

  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

},{}],12:[function(require,module,exports){
module.exports={"entities":{"Q21972834":{"pageid":24004990,"ns":0,"title":"Q21972834","lastrevid":594203123,"modified":"2017-11-14T19:42:25Z","type":"item","id":"Q21972834","labels":{"en":{"language":"en","value":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data"},"nl":{"language":"nl","value":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data"}},"descriptions":{"en":{"language":"en","value":"scientific article"},"nl":{"language":"nl","value":"wetenschappelijk artikel (gepubliceerd op 2013/06/15)"},"cs":{"language":"cs","value":"v\u011bdeck\u00fd \u010dl\u00e1nek publikovan\u00fd v roce 2013"},"fr":{"language":"fr","value":"article scientifique (publi\u00e9 2013/06/15)"},"it":{"language":"it","value":"articolo scientifico (pubblicato il 2013/06/15)"},"da":{"language":"da","value":"videnskabelig artikel (udgivet  2013/06/15)"},"sk":{"language":"sk","value":"vedeck\u00fd \u010dl\u00e1nok (publikovan\u00fd 2013/06/15)"},"pt":{"language":"pt","value":"artigo cient\u00edfico (publicado na 2013/06/15)"},"hy":{"language":"hy","value":"\u0563\u056b\u057f\u0561\u056f\u0561\u0576 \u0570\u0578\u0564\u057e\u0561\u056e"},"ar":{"language":"ar","value":"\u0645\u0642\u0627\u0644\u0629 \u0639\u0644\u0645\u064a\u0629 (\u0646\u0634\u0631\u062a \u0641\u064a 15-6-2013)"},"de":{"language":"de","value":"wissenschaftlicher Artikel (ver\u00f6ffentlicht am 15 Juni 2013)"},"sq":{"language":"sq","value":"artikull shkencor"},"ko":{"language":"ko","value":"2013\ub144 \ub17c\ubb38"},"tg-cyrl":{"language":"tg-cyrl","value":"\u043c\u0430\u049b\u043e\u043b\u0430\u0438 \u0438\u043b\u043c\u04e3"},"sr-el":{"language":"sr-el","value":"nau\u010dni \u010dlanak"},"bg":{"language":"bg","value":"\u043d\u0430\u0443\u0447\u043d\u0430 \u0441\u0442\u0430\u0442\u0438\u044f"},"es":{"language":"es","value":"art\u00edculo cient\u00edfico publicado en 2013"},"lt":{"language":"lt","value":"mokslinis straipsnis"},"vi":{"language":"vi","value":"b\u00e0i b\u00e1o khoa h\u1ecdc"},"ru":{"language":"ru","value":"\u043d\u0430\u0443\u0447\u043d\u0430\u044f \u0441\u0442\u0430\u0442\u044c\u044f"},"ast":{"language":"ast","value":"art\u00edculu cient\u00edficu"},"ka":{"language":"ka","value":"\u10e1\u10d0\u10db\u10d4\u10ea\u10dc\u10d8\u10d4\u10e0\u10dd \u10e1\u10e2\u10d0\u10e2\u10d8\u10d0"},"zh-my":{"language":"zh-my","value":"2013\u5e74\u8bba\u6587"},"sr":{"language":"sr","value":"\u043d\u0430\u0443\u0447\u043d\u0438 \u0447\u043b\u0430\u043d\u0430\u043a"},"ca":{"language":"ca","value":"article cient\u00edfic"},"zh-hk":{"language":"zh-hk","value":"2013\u5e74\u8ad6\u6587"},"sr-ec":{"language":"sr-ec","value":"\u043d\u0430\u0443\u0447\u043d\u0438 \u0447\u043b\u0430\u043d\u0430\u043a"},"he":{"language":"he","value":"\u05de\u05d0\u05de\u05e8 \u05de\u05d3\u05e2\u05d9"},"tg":{"language":"tg","value":"\u043c\u0430\u049b\u043e\u043b\u0430\u0438 \u0438\u043b\u043c\u04e3"},"nan":{"language":"nan","value":"2013 n\u00ee l\u016bn-b\u00fbn"},"sv":{"language":"sv","value":"vetenskaplig artikel"},"zh-hant":{"language":"zh-hant","value":"2013\u5e74\u8ad6\u6587"},"eo":{"language":"eo","value":"scienca artikolo"},"yue":{"language":"yue","value":"2013\u5e74\u8ad6\u6587"},"zh-hans":{"language":"zh-hans","value":"2013\u5e74\u8bba\u6587"},"nn":{"language":"nn","value":"vitskapeleg artikkel"},"pt-br":{"language":"pt-br","value":"artigo cient\u00edfico"},"hu":{"language":"hu","value":"tudom\u00e1nyos cikk"},"et":{"language":"et","value":"teaduslik artikkel"},"zh-tw":{"language":"zh-tw","value":"2013\u5e74\u8ad6\u6587"},"oc":{"language":"oc","value":"article scientific"},"el":{"language":"el","value":"\u03b5\u03c0\u03b9\u03c3\u03c4\u03b7\u03bc\u03bf\u03bd\u03b9\u03ba\u03cc \u03ac\u03c1\u03b8\u03c1\u03bf"},"tr":{"language":"tr","value":"bilimsel makale"},"zh-cn":{"language":"zh-cn","value":"2013\u5e74\u8bba\u6587"},"nb":{"language":"nb","value":"vitenskapelig artikkel"},"zh-mo":{"language":"zh-mo","value":"2013\u5e74\u8ad6\u6587"},"gl":{"language":"gl","value":"artigo cient\u00edfico"},"pl":{"language":"pl","value":"artyku\u0142 naukowy"},"th":{"language":"th","value":"\u0e1a\u0e17\u0e04\u0e27\u0e32\u0e21\u0e17\u0e32\u0e07\u0e27\u0e34\u0e17\u0e22\u0e32\u0e28\u0e32\u0e2a\u0e15\u0e23\u0e4c"},"tl":{"language":"tl","value":"artikulong pang-agham"},"ro":{"language":"ro","value":"articol \u0219tiin\u021bific"},"zh-sg":{"language":"zh-sg","value":"2013\u5e74\u8bba\u6587"},"uk":{"language":"uk","value":"\u043d\u0430\u0443\u043a\u043e\u0432\u0430 \u0441\u0442\u0430\u0442\u0442\u044f"},"zh":{"language":"zh","value":"2013\u5e74\u8bba\u6587"},"ja":{"language":"ja","value":"2013\u5e74\u306e\u8ad6\u6587"},"wuu":{"language":"wuu","value":"2013\u5e74\u8bba\u6587"},"fi":{"language":"fi","value":"tieteellinen artikkeli"}},"aliases":[],"claims":{"P698":[{"mainsnak":{"snaktype":"value","property":"P698","datavalue":{"value":"23698863","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$D435A2F3-E2A8-45A7-922A-A6BB72F9A79C","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P932":[{"mainsnak":{"snaktype":"value","property":"P932","datavalue":{"value":"3673215","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$F4959183-FB89-410E-BF33-DF9B1AF81ECE","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P31":[{"mainsnak":{"snaktype":"value","property":"P31","datavalue":{"value":{"entity-type":"item","numeric-id":13442814,"id":"Q13442814"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$E4DCC072-BD1A-4FDF-BFED-E1D981E5E81F","rank":"normal"}],"P1476":[{"mainsnak":{"snaktype":"value","property":"P1476","datavalue":{"value":{"text":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q21972834$D8C2FFB6-2710-4AFA-92A3-A859ABAA1FED","rank":"normal"}],"P478":[{"mainsnak":{"snaktype":"value","property":"P478","datavalue":{"value":"29","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$963935D7-041A-4E92-9D9B-F254A5426BAD","rank":"normal"}],"P433":[{"mainsnak":{"snaktype":"value","property":"P433","datavalue":{"value":"12","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$47B925A9-A53F-43A3-888D-BEA79E399D4D","rank":"normal"}],"P577":[{"mainsnak":{"snaktype":"value","property":"P577","datavalue":{"value":{"time":"+2013-06-15T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"},"type":"statement","id":"Q21972834$9EDE475C-7403-4A66-A6A5-0458E7782689","rank":"normal"}],"P304":[{"mainsnak":{"snaktype":"value","property":"P304","datavalue":{"value":"1492-7","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$92D5DD57-B5F0-42B6-9508-6D5CEB82FF3C","rank":"normal"}],"P2093":[{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Anthony Raymond","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"7241753c62a310cf84895620ea82250dcea65835","datavalue":{"value":"2","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$BC54A9F8-68FF-4F6E-8111-A449A15BDB57","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Shaun D Jackman","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"0e979f28bf306fefdcd352b4eb8dee5da2153a6d","datavalue":{"value":"3","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CB76DCFD-DA2A-4673-ACDB-B8CA71D1069C","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Stephen Pleasance","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"cbff8d4b3b7b35f905ef3147a7a6cb88845a774f","datavalue":{"value":"4","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CC360BCE-0D0D-4E92-8F68-1780D1106620","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Robin Coope","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ea4583c18f699186700d21642b477a2dc1d345c8","datavalue":{"value":"5","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$EC1B7589-BE7F-450C-B4AE-978EF4440682","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Greg A Taylor","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"32387bd293902a2430b5bb680033d36ecea00dd0","datavalue":{"value":"6","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$AA1A005B-0985-4CCB-AB13-782A3385EB54","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Macaire Man Saint Yuen","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"9a4403310d2d27312d0a93830981a1e51b735843","datavalue":{"value":"7","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$A0812623-AA81-48CB-AA51-1E04CCC21FE9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Dana Brand","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a9a9c98c803f52f2debc2c74270b3bd0c1f753d9","datavalue":{"value":"9","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$6A62350D-4505-43DF-A8D4-719B8282ED8E","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Benjamin P Vandervalk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"51210afb13f62d7537a51c61ba9b9586db143c24","datavalue":{"value":"10","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$B78884CC-1F88-45B1-B1B3-DD9DDF2B2FBE","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Heather Kirk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"4fda4e2a606f90da339710b3368ca24eb2d05ec1","datavalue":{"value":"11","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$C9117C71-EAEB-4DC0-909B-9876C53A3802","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Pawan Pandoh","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"b1425a27074b51abb46a9cb949eb37d115c2204a","datavalue":{"value":"12","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$22C57E2F-6C2C-46DC-B184-0CA7F529B6C3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Richard A Moore","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f156fb34fcce34ed7b7ab814d08b4f127f7d0c0a","datavalue":{"value":"13","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$C86DCED7-41A0-4653-9E9F-AEDD1BB5392C","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Yongjun Zhao","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"2c80382503f2260434d0a61f856e7202ac2ef14e","datavalue":{"value":"14","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$507B8D2B-1EA4-492D-93E8-3D9236BDECB7","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Andrew J Mungall","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"1c30b5edfe37c20fba82e77d50973f05e0b11f6f","datavalue":{"value":"15","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$99499BC4-F219-4E8E-B79C-0FFC4AF1919F","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Barry Jaquish","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"fad4d36a0de768e4b914ae40a3ab93ff76802562","datavalue":{"value":"16","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$2A452CB5-1392-48A3-8BDF-C3859ECD2CD7","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Alvin Yanchuk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"1486eb16323ccfa872de81f5a62795658dfa8c93","datavalue":{"value":"17","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$ED126A91-2089-4B3C-8BB6-D7FE81E05C63","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Brian Boyle","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a37679c5dba91ad0c4813c3c62af8ac5d2a1e00d","datavalue":{"value":"19","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$9D020847-DAD2-4573-8896-C6826BEBB4DD","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Jean Bousquet","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"56e77a2eea22fa436528789b1e88f73ebce53a92","datavalue":{"value":"20","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$76CDF015-D56A-4539-9A29-ED6328566BA9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"John Mackay","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f5a226ebb11ff3cb8c41370357acdc8ede4a3224","datavalue":{"value":"22","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$382410E5-912A-4D08-BEA6-238379D5BA61","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Steven J M Jones","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"0f81c461e0edbb9c5613e6b49511d44fefcaeec1","datavalue":{"value":"24","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$E584D000-D3FA-48EB-B0B6-18A64D489469","rank":"normal"}],"P2860":[{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21183990,"id":"Q21183990"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$067675E1-BE45-48EC-9927-9B505DCD2C38","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22065964,"id":"Q22065964"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$B272C2D7-F0C1-4B7E-B5F0-ADBD60D235EB","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24629733,"id":"Q24629733"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$85D12800-291A-4885-8DDE-42657DE6E026","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24625559,"id":"Q24625559"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$EA35C15C-3F08-41DE-A369-06B084B6BAA3","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22122211,"id":"Q22122211"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$9F920256-4000-405C-AACB-E96C6D992603","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21183889,"id":"Q21183889"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8F12AA50-1D1B-42C6-B6AD-E9A9587F53EB","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21261967,"id":"Q21261967"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$A4899485-8489-4D70-82E7-82C216106962","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24807126,"id":"Q24807126"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$FD2F304E-61D2-41EE-8AB5-B5CA1267B7CB","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21045365,"id":"Q21045365"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$113AD736-4A2B-479D-BA9D-0615FEA01A84","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22122143,"id":"Q22122143"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$16FE34E1-5AAC-4D98-898A-7CC4699861F0","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22065842,"id":"Q22065842"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$A0BF94ED-B679-4A17-B68A-2FE7AF6858AA","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":25938991,"id":"Q25938991"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$513BAA39-8D82-4485-A25D-DB222C90B284","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27860816,"id":"Q27860816"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$DD899F96-5D71-4BBC-A87E-B710B870C6C3","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":29547263,"id":"Q29547263"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$6841DAE3-4A88-426D-878D-A8320B56F389","rank":"normal","references":[{"hash":"027d43a2f0e454d327c064532b8169344ca9c479","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-04-07T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":29547486,"id":"Q29547486"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8DB197DA-99D5-436F-AA57-3553E59F0575","rank":"normal","references":[{"hash":"027d43a2f0e454d327c064532b8169344ca9c479","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-04-07T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":36601316,"id":"Q36601316"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$483D0AAB-8A16-494B-96F5-A507460BD5D5","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34543255,"id":"Q34543255"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$65364437-C75A-45F4-8907-482D125C66CA","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34533338,"id":"Q34533338"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$BC4B4E8C-F714-45CF-8C05-7980AAECB044","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34350757,"id":"Q34350757"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$DD7EB85B-9B3D-4BF7-B704-64759D231C5F","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34251827,"id":"Q34251827"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$76315A27-AE66-4137-8B5F-183097F5425E","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34241401,"id":"Q34241401"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8F4EC1C1-A1EF-48C5-9367-BDB40377B74D","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":35362616,"id":"Q35362616"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$B56DF036-3F98-4EDE-AB53-E10D182E3006","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34217144,"id":"Q34217144"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$66B679B2-45E4-41A3-B97A-D42C704DAD1F","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34020907,"id":"Q34020907"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$0D0FA045-842B-4ADB-B6A7-AD2ABE53B112","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":33375873,"id":"Q33375873"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$E78669A8-D271-4542-8540-8BC00D59B227","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":41000676,"id":"Q41000676"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$75EBD061-E902-4A52-B985-DF80811A7613","rank":"normal","references":[{"hash":"573e725ddbb0ec0ba9390fd06f5ca02d8842d7fa","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-27T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]}],"P1433":[{"mainsnak":{"snaktype":"value","property":"P1433","datavalue":{"value":{"entity-type":"item","numeric-id":4914910,"id":"Q4914910"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$72BB933D-4685-4F38-AE7C-1FBB71952A69","rank":"normal","references":[{"hash":"0f777b69d8d3a65ccde0a935ad2e100b32e54ef9","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":180686,"id":"Q180686"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"snaks-order":["P248"]}]}],"P3181":[{"mainsnak":{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$FDDF4A83-6970-4A50-8A59-26DFA5C2621C","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P921":[{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":128116,"id":"Q128116"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$e8eae0f3-4581-47f5-9528-04c967854423","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":1073526,"id":"Q1073526"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$64a4a2b9-4d01-0532-bfd4-605bd9484f3c","rank":"normal"}],"P356":[{"mainsnak":{"snaktype":"value","property":"P356","datavalue":{"value":"10.1093/BIOINFORMATICS/BTT178","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$2FB0F783-8FE0-4E40-9080-7CD9DBD6906B","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P50":[{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984952,"id":"Q32984952"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a921621b61855fb454e1096de9b0fc91b21bfa9b","datavalue":{"value":"23","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$F3B493D0-A576-4959-8950-6D43D7995CC4","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984953,"id":"Q32984953"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"9d22b928e2a536181e7576da40198990b72f9197","datavalue":{"value":"21","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$27A38427-E938-4631-A0F4-7992D282E8F9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984954,"id":"Q32984954"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"618cb6a0b47e3e935e91ad6a5bd476a8d3f4fb33","datavalue":{"value":"18","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$9283F501-FB54-42BB-A504-3F07A499867F","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984957,"id":"Q32984957"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"2a1ced1dca90648ea7e306acbadd74fc81a10722","datavalue":{"value":"1","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$95E03FEE-E787-429D-A330-63D5AA1A4538","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":43147587,"id":"Q43147587"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"94d4f77373c2051829a238495246b458b7737ef9","datavalue":{"value":"8","type":"string"},"datatype":"string"}],"P1932":[{"snaktype":"value","property":"P1932","hash":"6530fee4ffabeab260a77bf78146abde9523a870","datavalue":{"value":"Christopher I Keeling","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545","P1932"],"id":"Q21972834$1F045850-DBC8-46DE-B6FA-C0AA8BF25B3C","rank":"normal"}],"P407":[{"mainsnak":{"snaktype":"value","property":"P407","datavalue":{"value":{"entity-type":"item","numeric-id":1860,"id":"Q1860"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$785E0AE5-4741-443B-B8F2-039E4F1935A4","rank":"normal"}]},"sitelinks":[]}}}
},{}],13:[function(require,module,exports){
module.exports={"entities":{"Q27795847":{"pageid":29511090,"ns":0,"title":"Q27795847","lastrevid":453265099,"modified":"2017-02-20T20:13:32Z","type":"item","id":"Q27795847","labels":{"en":{"language":"en","value":"SPLASH, a hashed identifier for mass spectra"},"nl":{"language":"nl","value":"SPLASH, a hashed identifier for mass spectra"}},"descriptions":{"fr":{"language":"fr","value":"article scientifique (publi\u00e9 2016/11/08)"},"cs":{"language":"cs","value":"v\u011bdeck\u00fd \u010dl\u00e1nek publikovan\u00fd v roce 2016"},"nl":{"language":"nl","value":"wetenschappelijk artikel (gepubliceerd op 2016/11/08)"},"it":{"language":"it","value":"articolo scientifico (pubblicato il 2016/11/08)"},"sk":{"language":"sk","value":"vedeck\u00fd \u010dl\u00e1nok (publikovan\u00fd 2016/11/08)"},"da":{"language":"da","value":"videnskabelig artikel (udgivet  2016/11/08)"},"pt":{"language":"pt","value":"artigo cient\u00edfico (publicado na 2016/11/08)"},"en":{"language":"en","value":"scientific article"},"hy":{"language":"hy","value":"\u0563\u056b\u057f\u0561\u056f\u0561\u0576 \u0570\u0578\u0564\u057e\u0561\u056e"}},"aliases":[],"claims":{"P31":[{"mainsnak":{"snaktype":"value","property":"P31","datavalue":{"value":{"entity-type":"item","numeric-id":13442814,"id":"Q13442814"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$FE0E533D-7E2D-4FC1-AB73-22196E9D9455","rank":"normal"}],"P577":[{"mainsnak":{"snaktype":"value","property":"P577","datavalue":{"value":{"time":"+2016-11-08T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"},"type":"statement","id":"Q27795847$7695c7e8-4988-843f-d638-1a765f6bd0f1","rank":"normal"}],"P1476":[{"mainsnak":{"snaktype":"value","property":"P1476","datavalue":{"value":{"text":"SPLASH, a hashed identifier for mass spectra","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q27795847$c12e8199-4e9b-8d86-1f89-c53255e1b89f","rank":"normal"}],"P2093":[{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Gert Wohlgemuth","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"862c83ca2949d7eb8f41b4bf1a4521ed18cdebb8","datavalue":{"value":"1","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"17f7c88944bcd21a5b1de89be8babd7895377505","datavalue":{"value":{"entity-type":"item","numeric-id":129421,"id":"Q129421"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$5a37a217-4790-7488-341c-3f40aac679d5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Sajjan S Mehta","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"af1310a34ec80620d4fdd7bb8ca76e492fe6630e","datavalue":{"value":"2","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$e029413e-465a-6e7f-bbc4-7bf7d095bdf5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Ramon F Mejia","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"3c1e388cba3487113121af5bfa59a2f657bf21bd","datavalue":{"value":"3","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$459a6034-4de2-d02c-71b3-de0d009d3ca0","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Diego Pedrosa","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c8e1b85012703eb0f44ff876ec773596f3794872","datavalue":{"value":"5","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$27938ccf-4c1f-0fdc-5250-8c9b7ab1ab0c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Tom\u00e1\u0161 Pluskal","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5d30572c5a5693878a66231c29c9bb3e4a870527","datavalue":{"value":"6","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"a47de0d3aa3e3d2844ebf22e9624c4efb47ccbdd","datavalue":{"value":{"entity-type":"item","numeric-id":825987,"id":"Q825987"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$4414bb01-4540-a5d2-bb41-78cee294f865","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Michael Wilson","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ebbb7b4bd5f12eaa0eb9415b51fd725fd993a644","datavalue":{"value":"9","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$b76ba909-4412-7b4b-1b29-acc6b19a31c3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Masanori Arita","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"938c75f8b1bafb9e19a4c1a079b8b8e5d997c7fa","datavalue":{"value":"11","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"6f8ef5a2bbb33916e6b5870a7274e8730efa1f21","datavalue":{"value":{"entity-type":"item","numeric-id":1153275,"id":"Q1153275"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$f55f9709-47c0-879a-80ee-468a59ee7993","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Pieter C Dorrestein","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"472f0889b6914293dcbc4d0f62bb3e3ce6d37ce0","datavalue":{"value":"12","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$8c511a6b-4213-8d9d-ed2c-61261d710ca9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Nuno Bandeira","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a0d6d71b9401a527331dc2a8a59c54448b5ad98c","datavalue":{"value":"13","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$84869301-4041-a4b4-3496-f0f724c03ac5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Mingxun Wang","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"89d1857be00646d34838dc372e42882e3e20dca2","datavalue":{"value":"14","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"777bee7b0612da6cfca8a663b6c60ffdbed72f98","datavalue":{"value":{"entity-type":"item","numeric-id":622664,"id":"Q622664"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$d1287f99-4e2f-c26a-2257-1fa71a5f9b67","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Tobias Schulze","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"502af995394385a6c11fd2f00b65598853ceedc5","datavalue":{"value":"15","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$05d35d06-4164-b410-d163-7228c8a6bacf","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Reza M Salek","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f83c26be8edcec43a735fc3c85792c85d186a3c0","datavalue":{"value":"16","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$975616fd-41c1-5797-f792-16d317d4e17c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Venkata Chandrasekhar Nainala","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c5201cb20b41dc2f0e2cf1361e16829d4cfbeac8","datavalue":{"value":"18","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$68c00f70-40f7-52ac-6b51-27340aee5757","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Robert Mistrik","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5ffccd25ee75ecddecb8ccbb1a59226cc3ba535a","datavalue":{"value":"19","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$7e774c4a-41f4-c0c9-b0ee-391e74a772dd","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Takaaki Nishioka","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"481220fb9e6317d9e822186cb47365497d25e036","datavalue":{"value":"20","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$8d8845f3-44c5-b259-8aea-b55827411fdc","rank":"normal"}],"P478":[{"mainsnak":{"snaktype":"value","property":"P478","datavalue":{"value":"34","type":"string"},"datatype":"string"},"type":"statement","id":"Q27795847$a090a3aa-4a02-fbe5-9aca-df819f80e84c","rank":"normal"}],"P304":[{"mainsnak":{"snaktype":"value","property":"P304","datavalue":{"value":"1099\u20131101","type":"string"},"datatype":"string"},"type":"statement","id":"Q27795847$9ec79308-4361-58b7-2219-df398124c52e","rank":"normal"}],"P1433":[{"mainsnak":{"snaktype":"value","property":"P1433","datavalue":{"value":{"entity-type":"item","numeric-id":1893837,"id":"Q1893837"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b771b8e8-4ccd-82d8-02e0-df734ad9b35b","rank":"normal"}],"P921":[{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":12149006,"id":"Q12149006"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b4edba31-4e22-d1d0-60fd-8e7a4258a3a4","rank":"normal"}],"P50":[{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":5111731,"id":"Q5111731"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a89a718f20b227073f3b4f3aa4ad0e99ba77b542","datavalue":{"value":"17","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"3c814103e8488af45c5f9ddb4f3a83548284f46a","datavalue":{"value":{"entity-type":"item","numeric-id":1341845,"id":"Q1341845"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$cfda0f9e-40ab-fe07-d2c1-a646a2588c34","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":20895241,"id":"Q20895241"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c6a0d2bbafefdc6d21b25af4357c9887085c2f89","datavalue":{"value":"8","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"f3f4b1106be9c9432af1675a98182889725faf11","datavalue":{"value":{"entity-type":"item","numeric-id":19845644,"id":"Q19845644"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P1932":[{"snaktype":"value","property":"P1932","hash":"f897727ae72d779987cc1cbb9f667d3e7c74a0c2","datavalue":{"value":"Egon L Willighagen","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545","P1416","P1932"],"id":"Q27795847$4a94239d-4f1b-77a8-41b6-2c04e1f5a079","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":27863244,"id":"Q27863244"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ecdcd65e6c9f103dedc06d856ce957af15050f7b","datavalue":{"value":"7","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"2af45dffb1e796266913f5fecff0b01fb42a2142","datavalue":{"value":{"entity-type":"item","numeric-id":678765,"id":"Q678765"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$85eb14b2-4d1e-fbaa-ce18-7b92398da5d5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":27887604,"id":"Q27887604"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"6d824c4548dc9c84054b9e446b8ea72e50efebba","datavalue":{"value":"10","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"072d0bc1ba7876a9edfe9766e4dd2c83d759f3e6","datavalue":{"value":{"entity-type":"item","numeric-id":640694,"id":"Q640694"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$34c7ffad-48b7-582d-aee0-04e6694250fb","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":28540892,"id":"Q28540892"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a39223fc722bb1c9ca54fe188d9596d0c68f055e","datavalue":{"value":"21","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"17f7c88944bcd21a5b1de89be8babd7895377505","datavalue":{"value":{"entity-type":"item","numeric-id":129421,"id":"Q129421"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$990b9ecd-4746-5ebc-2209-510172d627f2","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":28541023,"id":"Q28541023"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a82b0aa3ccf1a266e15473824b4391f6d9da4be0","datavalue":{"value":"4","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$a9af48e3-4afb-4281-1b0b-7c8405afd325","rank":"normal"}],"P2860":[{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21093640,"id":"Q21093640"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$51189732-4cae-29ac-9c3d-5f52e4076684","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807487,"id":"Q27807487"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b3a68adf-4629-432a-a2fe-c5afb5d478a0","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807488,"id":"Q27807488"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$25db773a-4265-1451-58ff-d9a8d0fc2c90","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27136473,"id":"Q27136473"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$906aa8f9-4163-5c7c-c17e-7a83329babee","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807490,"id":"Q27807490"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$6a239bbf-4e74-5eb1-dd40-1bd734e00dad","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807493,"id":"Q27807493"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$a6aaa6b6-4fab-6667-4347-08af84b83958","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807494,"id":"Q27807494"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$6e77205b-4fea-719e-237e-323ffdc5de53","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807496,"id":"Q27807496"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$fd046765-4ec1-4773-dbc4-adb5a2d43490","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27809667,"id":"Q27809667"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$13ecb48e-49bf-5c2c-81a7-dcbc953f46fc","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818844,"id":"Q27818844"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$9569723d-4d9b-05ad-dfaa-f0be798cc8e4","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24595162,"id":"Q24595162"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$8a414bd4-4676-dfa6-70bf-2cc8ffdfdb9c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818909,"id":"Q27818909"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$ef170bc8-4a44-e40b-209c-9fad35846433","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818910,"id":"Q27818910"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$e101201a-4092-253b-ea90-80b52d65e153","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21030547,"id":"Q21030547"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$39288916-4bcc-bb5d-6165-a3e7d8557230","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21146620,"id":"Q21146620"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$1e9ee22e-4181-0f42-3bac-8b6bf7325ddc","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818912,"id":"Q27818912"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$15ec6ec7-4db2-3bbb-bfaf-a924b6482e51","rank":"normal"}],"P1104":[{"mainsnak":{"snaktype":"value","property":"P1104","datavalue":{"value":{"amount":"+3","unit":"1","upperBound":"+4","lowerBound":"+2"},"type":"quantity"},"datatype":"quantity"},"type":"statement","id":"Q27795847$be33113d-4b0c-7756-ecf1-ec78c0605209","rank":"normal"}],"P953":[{"mainsnak":{"snaktype":"value","property":"P953","datavalue":{"value":"http://rdcu.be/msZj","type":"string"},"datatype":"url"},"type":"statement","id":"Q27795847$9ae54b43-42bd-2c08-9347-eecb6838ae00","rank":"normal"}],"P698":[{"mainsnak":{"snaktype":"value","property":"P698","datavalue":{"value":"27824832","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q27795847$7CCFB068-30E5-4A85-A1AA-85981F7752E8","rank":"normal"}],"P356":[{"mainsnak":{"snaktype":"value","property":"P356","datavalue":{"value":"10.1038/NBT.3689","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q27795847$BDC0D3CE-51FB-4058-B1AE-BD9CF1DCB5DE","rank":"normal"}]},"sitelinks":[]}}}
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUp = void 0;

var setUp = function setUp() {};

exports.setUp = setUp;

},{}],15:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _api = require("./api");

var _parse = _interopRequireDefault(require("./input/parse"));

var _parse2 = _interopRequireDefault(require("./output/parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

(0, _api.setUp)('wikidata');
describe('.async()', function () {
  var noGraph = {
    generateGraph: false
  };
  context('with callback', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            it('works', function () {
              return new Promise(function (resolve) {
                _citation.default.async(_parse.default.wd.id, noGraph, function (instance) {
                  (0, _expect.default)(instance).to.be.a(_citation.default);
                  (0, _expect.default)(instance.data).to.eql(_parse2.default.wd.simple);
                  resolve();
                });
              });
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  context('as promise', function () {
    it('works', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var instance;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _citation.default.async(_parse.default.wd.id, noGraph);

            case 2:
              instance = _context2.sent;
              (0, _expect.default)(instance).to.be.a(_citation.default);
              (0, _expect.default)(instance.data).to.eql(_parse2.default.wd.simple);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
  });
});

},{"./api":14,"./citation":16,"./input/parse":21,"./output/parse":24,"expect.js":"expect.js"}],16:[function(require,module,exports){
module.exports = require('citation-js');

},{"citation-js":"citation-js"}],17:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _cite = _interopRequireDefault(require("./input/cite"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noGraph = {
  generateGraph: false
};
describe('Cite instance', function () {
  describe('initialisation', function () {
    it('returns a Cite object', function () {
      return (0, _expect.default)(new _citation.default()).to.be.a(_citation.default);
    });
    context('via function', function () {
      return it('returns a Cite object', function () {
        return (0, _expect.default)((0, _citation.default)()).to.be.a(_citation.default);
      });
    });
  });
  describe('iteration', function () {
    return it('works', function () {
      (0, _expect.default)(new _citation.default()[Symbol.iterator]).to.be.a('function');
      (0, _expect.default)(_toConsumableArray(new _citation.default(_cite.default.ids, noGraph))).to.eql(_cite.default.ids);
    });
  });
  describe('function', function () {
    var test;
    beforeEach(function () {
      test = new _citation.default(_cite.default.empty);
    });
    describe('add()', function () {
      it('works', function () {
        test.add(_cite.default.empty);
        (0, _expect.default)(test.data).to.have.length(2);
        (0, _expect.default)(test.log).to.have.length(1);
      });
      it('saves', function () {
        test.add(_cite.default.empty, true);
        (0, _expect.default)(test.data).to.have.length(2);
        (0, _expect.default)(test.log).to.have.length(2);
      });
    });
    describe('set()', function () {
      it('works', function () {
        test.set(_cite.default.ids, noGraph);
        (0, _expect.default)(test.data).to.have.length(2);
        (0, _expect.default)(test.data).to.eql(_cite.default.ids);
        (0, _expect.default)(test.log).to.have.length(1);
      });
      it('saves', function () {
        test.set(_cite.default.empty, true);
        (0, _expect.default)(test.data).to.have.length(1);
        (0, _expect.default)(test.log).to.have.length(2);
      });
    });
    describe('addAsync()', function () {
      it('works', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return test.addAsync(_cite.default.empty);

              case 2:
                (0, _expect.default)(test.data).to.have.length(2);
                (0, _expect.default)(test.log).to.have.length(1);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })));
      it('saves', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return test.addAsync(_cite.default.empty, true);

              case 2:
                (0, _expect.default)(test.data).to.have.length(2);
                (0, _expect.default)(test.log).to.have.length(2);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
    });
    describe('setAsync()', function () {
      it('works', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return test.setAsync(_cite.default.ids, noGraph);

              case 2:
                (0, _expect.default)(test.data).to.have.length(2);
                (0, _expect.default)(test.data).to.eql(_cite.default.ids);
                (0, _expect.default)(test.log).to.have.length(1);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      })));
      it('saves', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return test.setAsync(_cite.default.empty, true);

              case 2:
                (0, _expect.default)(test.data).to.have.length(1);
                (0, _expect.default)(test.log).to.have.length(2);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));
    });
    describe('reset()', function () {
      it('works', function () {
        test.reset();
        (0, _expect.default)(test.data).to.have.length(0);
        (0, _expect.default)(test.log).to.have.length(1);
      });
      it('saves', function () {
        test.add(_cite.default.empty);
        test.reset(true);
        (0, _expect.default)(test.data).to.have.length(0);
        (0, _expect.default)(test.log).to.have.length(2);
      });
    });
    describe('options()', function () {
      it('works', function () {
        test.options({
          format: '1'
        });
        (0, _expect.default)(test._options.format).to.be('1');
        (0, _expect.default)(test.log).to.have.length(1);
      });
      it('saves', function () {
        test.options({
          format: '2'
        }, true);
        (0, _expect.default)(test._options.format).to.be('2');
        (0, _expect.default)(test.log).to.have.length(2);
      });
    });
    describe('currentVersion()', function () {
      it('works', function () {
        (0, _expect.default)(test.currentVersion()).to.be(1);
        test.add(_cite.default.empty, true);
        (0, _expect.default)(test.currentVersion()).to.be(2);
      });
    });
    describe('retrieveVersion()', function () {
      it('works', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.add(_cite.default.empty, true);
        (0, _expect.default)(test.log).to.have.length(2);
        var test2 = test.retrieveVersion(1);
        (0, _expect.default)(test2.log).to.have.length(1);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
      it('doesn\'t change origin data', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.add(_cite.default.empty, true);
        (0, _expect.default)(test.log).to.have.length(2);
        var test2 = test.retrieveVersion(1);
        (0, _expect.default)(test2.log).to.have.length(1);
        (0, _expect.default)(test2.data).to.have.length(1);
        (0, _expect.default)(test.log).to.have.length(2);
        (0, _expect.default)(test.data).to.have.length(2);
      });
      it('handles empty input', function () {
        test.add(_cite.default.empty, true);
        var image = test.retrieveVersion();
        (0, _expect.default)(image.data).to.have.length(1);
        (0, _expect.default)(image.log).to.have.length(1);
      });
      it('handles invalid input', function () {
        (0, _expect.default)(test.retrieveVersion(50)).to.be(null);
        (0, _expect.default)(test.retrieveVersion(-1)).to.be(null);
      });
    });
    describe('undo()', function () {
      it('works', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.add(_cite.default.empty, true).save();
        (0, _expect.default)(test.log).to.have.length(3);
        var test2 = test.undo();
        (0, _expect.default)(test2.log).to.have.length(2);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
      it('doesn\'t change origin data', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.add(_cite.default.empty, true).save();
        (0, _expect.default)(test.log).to.have.length(3);
        var test2 = test.undo();
        (0, _expect.default)(test.log).to.have.length(3);
        (0, _expect.default)(test.data).to.have.length(2);
        (0, _expect.default)(test2.log).to.have.length(2);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
    });
    describe('retrieveLastVersion()', function () {
      it('works', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.add(_cite.default.empty, true);
        (0, _expect.default)(test.log).to.have.length(2);
        var test2 = test.retrieveLastVersion();
        (0, _expect.default)(test2.log).to.have.length(2);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
      it('doesn\'t change origin data', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.add(_cite.default.empty, true);
        (0, _expect.default)(test.log).to.have.length(2);
        var test2 = test.retrieveLastVersion();
        (0, _expect.default)(test.log).to.have.length(2);
        (0, _expect.default)(test.data).to.have.length(2);
        (0, _expect.default)(test2.log).to.have.length(2);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
    });
    describe('save()', function () {
      it('works', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.save().add(_cite.default.empty).save();
        (0, _expect.default)(test.log).to.have.length(3);
        var test2 = test.undo();
        (0, _expect.default)(test2.log).to.have.length(2);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
      it('doesn\'t change origin data', function () {
        (0, _expect.default)(test.log).to.have.length(1);
        test.save().add(_cite.default.empty).save();
        (0, _expect.default)(test.log).to.have.length(3);
        var test2 = test.undo();
        (0, _expect.default)(test.log).to.have.length(3);
        (0, _expect.default)(test.data).to.have.length(2);
        (0, _expect.default)(test2.log).to.have.length(2);
        (0, _expect.default)(test2.data).to.have.length(1);
      });
    });
    describe('sort()', function () {
      it('works', function () {
        test.set(_cite.default.sort);
        (0, _expect.default)(test.data[0].author[0].family).to.be('b');
        (0, _expect.default)(test.data[1].author[0].family).to.be('a');
        test.sort();
        (0, _expect.default)(test.data[0].author[0].family).to.be('a');
        (0, _expect.default)(test.data[1].author[0].family).to.be('b');
        (0, _expect.default)(test.log).to.have.length(1);
      });
      it('saves', function () {
        test.set(_cite.default.sort);
        (0, _expect.default)(test.data[0].author[0].family).to.be('b');
        (0, _expect.default)(test.data[1].author[0].family).to.be('a');
        test.sort([], true);
        (0, _expect.default)(test.data[0].author[0].family).to.be('a');
        (0, _expect.default)(test.data[1].author[0].family).to.be('b');
        (0, _expect.default)(test.log).to.have.length(2);
      });
    });
    describe('getIds()', function () {
      it('works', function () {
        test.set(_cite.default.ids);
        (0, _expect.default)(test.data[0].id).to.be('b');
        (0, _expect.default)(test.data[1].id).to.be('a');
        var out = test.getIds();
        (0, _expect.default)(out[0]).to.be('b');
        (0, _expect.default)(out[1]).to.be('a');
      });
    });
  });
});

},{"./citation":16,"./input/cite":19,"expect.js":"expect.js"}],18:[function(require,module,exports){
"use strict";

var _syncRequest = _interopRequireDefault(require("sync-request"));

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _parse = _interopRequireDefault(require("./input/parse"));

var _parse2 = _interopRequireDefault(require("./output/parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

_parse.default.wd.simple = require('./Q21972834.json');
_parse.default.wd.author = require('./Q27795847.json');

try {
  (0, _syncRequest.default)();
} catch (e) {}

var wikidataTestCaseOptions = {
  callback: function callback(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        data = _ref2[0];

    return data.replace(/[&?]origin=\*/, '');
  },
  link: true
};
var doiLinkTestCaseOptions = {
  link: true
};
var doiTestCaseOptions = {
  link: true,
  callback: function callback(_ref3) {
    var title = _ref3.title;
    return title;
  }
};
var configs = {
  '@wikidata/id': [_parse.default.wd.id, _parse2.default.wd.api[0], wikidataTestCaseOptions],
  '@wikidata/list+text': {
    'separated by spaces': [_parse.default.wd.list.space, _parse2.default.wd.api[1], wikidataTestCaseOptions],
    'separated by newlines': [_parse.default.wd.list.newline, _parse2.default.wd.api[1], wikidataTestCaseOptions],
    'separated by commas': [_parse.default.wd.list.comma, _parse2.default.wd.api[1], wikidataTestCaseOptions]
  },
  '@wikidata/url': [_parse.default.wd.url, _parse2.default.wd.id, {
    link: true
  }],
  '@wikidata/object': {
    'without linked authors': [_parse.default.wd.simple, _parse2.default.wd.simple],
    'with linked authors': [_parse.default.wd.author, _parse2.default.wd.author]
  },
  '@doi/id': [_parse.default.doi.id, _parse2.default.doi.api[0], doiLinkTestCaseOptions],
  '@doi/api': [_parse.default.doi.url, _parse2.default.doi.simple.title, doiTestCaseOptions],
  '@doi/list+text': {
    'separated by spaces': [_parse.default.doi.list.space, _parse2.default.doi.api[1], doiLinkTestCaseOptions],
    'separated by newlines': [_parse.default.doi.list.newline, _parse2.default.doi.api[1], doiLinkTestCaseOptions]
  },
  '@bibtex/text': {
    'with one simple entry': [_parse.default.bibtex.simple, _parse2.default.bibtex.simple],
    'with whitespace and unknown fields': [_parse.default.bibtex.whitespace, _parse2.default.bibtex.whitespace],
    'with literals': [_parse.default.bibtex.literals, _parse2.default.bibtex.literals],
    'with year and month without date': [_parse.default.bibtex.yearMonthNeeded, _parse2.default.bibtex.yearMonthNeeded],
    'with year and month with date': [_parse.default.bibtex.yearMonth, _parse2.default.bibtex.yearMonth]
  },
  '@bibtex/object': [_parse.default.bibtex.json, _parse2.default.bibtex.simple],
  '@bibtxt/text': {
    'with one simple entry': [_parse.default.bibtxt.simple, [_parse2.default.bibtxt]],
    'with multiple entries': [_parse.default.bibtxt.multiple, [_parse2.default.bibtxt, _parse2.default.bibtex.simple[0]]],
    'with whitespace': [_parse.default.bibtxt.whitespace, [_parse2.default.bibtxt]]
  },
  '@bibjson/object': [_parse.default.bibjson.simple, _parse2.default.bibjson.simple],
  '@csl/object': [_parse.default.csl.simple, [_parse.default.csl.simple]],
  '@csl/list+object': [_parse.default.array.simple, _parse.default.array.simple],
  '@else/json': {
    'as JSON string': [JSON.stringify(_parse.default.csl.simple), [_parse.default.csl.simple]],
    'as JS Object string': [_parse.default.csl.string, [_parse.default.csl.simple]],
    'with a syntax error': ['{"hi"}', []]
  },
  '@else/list+object': [_parse.default.array.nested, _parse.default.array.simple],
  '@empty/text': ['', []],
  '@empty/whitespace+text': ['   \t\n \r  ', []],
  '@empty': {
    '(null)': [null, []],
    '(undefined)': [undefined, []]
  }
};

var testCaseGenerator = function testCaseGenerator(type, input, output) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function () {
    var _opts$requirements = opts.requirements,
        requirements = _opts$requirements === void 0 ? {} : _opts$requirements,
        callback = opts.callback,
        _opts$link = opts.link,
        link = _opts$link === void 0 ? false : _opts$link;
    var methods = _citation.default.parse.input;
    var method = link ? methods.chainLink : methods.chain;
    it('handles input type', function () {
      (0, _expect.default)(methods.type(input)).to.be(type);
    });
    it('parses input correctly', function () {
      var data = method(input, {
        generateGraph: false
      });

      if (typeof callback === 'function') {
        data = callback(data);
      }

      (0, _expect.default)(data).to.eql(output);
    });

    var _loop = function _loop(requirement) {
      var predicate = requirements[requirement];
      it(requirement, function () {
        return predicate(input, output, opts);
      });
    };

    for (var requirement in requirements) {
      _loop(requirement);
    }
  };
};

describe('input', function () {
  this.timeout(4000);

  var _loop2 = function _loop2(spec) {
    var specConfig = configs[spec];
    var callback = void 0;

    if (Array.isArray(specConfig)) {
      callback = testCaseGenerator.apply(void 0, [spec].concat(_toConsumableArray(specConfig)));
    } else {
      callback = function callback() {
        for (var specContext in specConfig) {
          context(specContext, testCaseGenerator.apply(void 0, [spec].concat(_toConsumableArray(specConfig[specContext]))));
        }
      };
    }

    describe(spec, callback);
  };

  for (var spec in configs) {
    _loop2(spec);
  }
});

},{"./Q21972834.json":12,"./Q27795847.json":13,"./citation":16,"./input/parse":21,"./output/parse":24,"expect.js":"expect.js","sync-request":5}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
module.exports={
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
    ],
    "locale": [{"id": "a", "type": "article-journal"}]
  }
}

},{}],21:[function(require,module,exports){
module.exports={
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
    "simple": "@article{Steinbeck2003, author = {Steinbeck, Christoph and Han, Yongquan and Kuhn, Stefan and Horlacher, Oliver and Luttmann, Edgar and Willighagen, Egon}, year = {2003}, pmid = 12653513, title = {{The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.}}, journal = {Journal of chemical information and computer sciences}, volume = {43}, number = {2}, pages = {493--500}, doi = {10.1021/ci025584y}, isbn = {2214707786}, issn = {0095-2338}, pmid = {12653513}, url = {http://www.ncbi.nlm.nih.gov/pubmed/12653513} }",
    "whitespace": "@inproceedings{Ekstrand:2009:RYD,\n author = {Michael D. Ekstrand and John T. Riedl},\n title = {rv you're dumb: Identifying Discarded Work in Wiki Article History},\n booktitle = {Proceedings of the 5th International Symposium on Wikis and Open Collaboration},\n series = {WikiSym '09},\n year = {2009},\n isbn = {978-1-60558-730-1},\n location = {Orlando, Florida},\n pages = {4:1--4:10},\n articleno = {4},\n numpages = {10},\n url = {https://dx.doi.org/10.1145/1641309.1641317},\n doi = {10.1145/1641309.1641317},\n acmid = {1641317},\n publisher = {ACM},\n address = {New York, NY, USA},\n keywords = {Wiki, Wikipedia, article history, visualization},\n}\n",
    "json": {
      "type": "article",
      "label": "Steinbeck2003",
      "properties": {
        "author": "Christoph Steinbeck and Yongquan Han and Stefan Kuhn and Oliver Horlacher and Edgar Luttmann and Egon Willighagen",
        "doi": "10.1021/ci025584y",
        "isbn": "2214707786",
        "issn": "0095-2338",
        "pmid": "12653513",
        "journal": "Journal of chemical information and computer sciences",
        "issue": "2",
        "pages": "493-500",
        "title": "The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.",
        "volume": "43",
        "year": "2003",
        "url": "http://www.ncbi.nlm.nih.gov/pubmed/12653513"
      }
    },
    "literals": "@a{b,author={{a and b} and c and D E},date={{13th Century}}}",
    "yearMonthNeeded": "@a{b,year=2017,month=8}",
    "yearMonth": "@a{b,date={2016-12-13},year=2017,month=8}"
  },
  "bibtxt": {
    "simple": "[Fau86]\n    author:    J.W. Goethe\n    title:     Faust. Der Tragödie Erster Teil\n    publisher: Reclam\n    year:      1986\n    address:   Stuttgart",
    "multiple": "[Fau86]\n    author:    J.W. Goethe\n    title:     Faust. Der Tragödie Erster Teil\n    publisher: Reclam\n    year:      1986\n    address:   Stuttgart\n\n  [Steinbeck2003]\n    type: article\n    author: Christoph Steinbeck and Yongquan Han and Stefan Kuhn and Oliver Horlacher and Edgar Luttmann and Egon Willighagen\n    doi: 10.1021/ci025584y\n    isbn: 2214707786\n    pmid: 12653513\n    issn: 0095-2338\n    journal: Journal of chemical information and computer sciences\n    issue: 2\n    pages: 493-500\n    title: The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.\n    volume: 43\n    year: 2003\n    url: http://www.ncbi.nlm.nih.gov/pubmed/12653513",
    "whitespace": "[Fau86]  \n      \n    author:    J.W. Goethe\n    title:     Faust. Der Tragödie Erster Teil\n    \n\n    publisher: Reclam\n    year:      1986  \n    address:   Stuttgart\n  "
  },
  "bibjson": {
    "simple": {
      "publisher": {"value": ["BioMed Central"]},
      "journal": {"value": ["Journal of Ethnobiology and Ethnomedicine"]},
      "title": {"value": ["Gitksan medicinal plants-cultural choice and efficacy"]},
      "authors": {"value": ["Leslie Main Johnson"]},
      "date": {"value": ["2006-06-21"]},
      "doi": {"value": ["10.1186/1746-4269-2-29"]},
      "volume": {"value": ["2"]},
      "issue": {"value": ["1"]},
      "firstpage": {"value": ["1"]},
      "fulltext_html": {"value": ["http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29"]},
      "fulltext_pdf": {"value": ["http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com"]},
      "license": {"value": ["This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited."]},
      "copyright": {"value": ["2006 Johnson; licensee BioMed Central Ltd."]}
    }
  },
  "csl": {
    "simple": {
      "id": "Q23571040",
      "type": "article-journal",
      "title": "Correlation of the Base Strengths of Amines 1",
      "DOI": "10.1021/ja01577a030",
      "author": [
        {"given": "H. K.", "family": "Hall"}
      ],
      "issued": [{"date-parts": ["1957", "1", "1"]}],
      "container-title": "Journal of the American Chemical Society",
      "volume": "79",
      "issue": "20",
      "page": "5441-5444"
    },
    "string": "[\n  {\n    id: \"Q23571040\",\n    type: \"article-journal\",\n    title: \"Correlation of the Base Strengths of Amines 1\",\n    DOI: \"10.1021/ja01577a030\",\n    author: [\n      {\n\tgiven: \"H. K.\",\n\tfamily: \"Hall\"\n      }\n    ],\n    issued: [\n      {\n\tdate-parts: [ \"1957\", \"1\", \"1\" ]\n      }\n    ],\n    container-title: \"Journal of the American Chemical Society\",\n    volume: \"79\",\n    issue: \"20\",\n    page: \"5441-5444\"\n  }\n]"
  },
  "array": {
    "simple": [{"id": "a"}, {"id": "b"}],
    "nested": [[{"id": "a"}], {"id": "b"}]
  }
}

},{}],22:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _get = _interopRequireDefault(require("./input/get"));

var _get2 = _interopRequireDefault(require("./output/get"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var customTemplate = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<style xmlns=\"http://purl.org/net/xbiblio/csl\" class=\"in-text\" version=\"1.0\" demote-non-dropping-particle=\"sort-only\" page-range-format=\"minimal\">\n  <bibliography>\n    <layout>\n      <text variable=\"title\"/>\n    </layout>\n  </bibliography>\n</style>";
var customLocale = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<locale xmlns=\"http://purl.org/net/xbiblio/csl\" version=\"1.0\" xml:lang=\"custom\">\n  <style-options punctuation-in-quote=\"true\"/>\n  <date form=\"text\">\n    <date-part name=\"month\" suffix=\" \"/>\n    <date-part name=\"day\" suffix=\", \"/>\n    <date-part name=\"year\"/>\n  </date>\n  <date form=\"numeric\">\n    <date-part name=\"month\" form=\"numeric-leading-zeros\" suffix=\"/\"/>\n    <date-part name=\"day\" form=\"numeric-leading-zeros\" suffix=\"/\"/>\n    <date-part name=\"year\"/>\n  </date>\n  <terms>\n    <term name=\"no date\" form=\"short\">custom</term>\n  </terms>\n</locale>";

var testCaseGenerator = function testCaseGenerator(data, options, output) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? function (v) {
    return v;
  } : _ref$callback,
      _ref$msg = _ref.msg,
      msg = _ref$msg === void 0 ? 'outputs correctly' : _ref$msg;

  return function () {
    var out = callback(data.get(options));
    out = typeof out === 'string' ? out.trim() : out;
    it(msg, function () {
      return (0, _expect.default)(out).to[_typeof(out) === 'object' ? 'eql' : 'be'](output);
    });
  };
};

var defaultOpts = _citation.default.prototype.defaultOptions;

var opts = function opts(format, type, style) {
  var lang = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultOpts.lang;
  return {
    format: format,
    type: type,
    style: style,
    lang: lang
  };
};

describe('output', function () {
  var data = new _citation.default(_get.default.csl.simple);
  describe('formatted CSL', function () {
    describe('html', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, opts('string', 'html', 'citation-apa'), _get2.default.csl.html.apa));
      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, opts('string', 'html', 'citation-vancouver'), _get2.default.csl.html.vancouver));
      describe('non-existent template', testCaseGenerator(data, opts('string', 'html', 'citation-larsgw'), _get2.default.csl.html.apa));
      describe('non-existent locale', testCaseGenerator(data, opts('string', 'html', 'citation-apa', 'larsgw'), _get2.default.csl.html.apa));
      describe('custom template', function () {
        _citation.default.CSL.register.addTemplate('custom', customTemplate);

        it('registers the template', function () {
          (0, _expect.default)(_citation.default.CSL.register.hasTemplate('custom')).to.be(true);
          (0, _expect.default)(_citation.default.CSL.register.getTemplate('custom')).to.be(customTemplate);
        });
        testCaseGenerator(data, opts('string', 'html', 'citation-custom'), _get2.default.csl.html.title)();
      });
      describe('custom locale', function () {
        var data = new _citation.default(_get.default.csl.locale);

        _citation.default.CSL.register.addLocale('custom', customLocale);

        it('registers the locale', function () {
          (0, _expect.default)(_citation.default.CSL.register.hasLocale('custom')).to.be(true);
          (0, _expect.default)(_citation.default.CSL.register.getLocale('custom')).to.be(customLocale);
        });
        testCaseGenerator(data, opts('string', 'html', 'citation-apa', 'custom'), _get2.default.csl.html.locale)();
      });
      describe('pre/append', function () {
        context('static', testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-apa',
          append: 'b',
          prepend: 'a'
        }, _get2.default.csl.html.wrappedStatic));
        context('dynamic', testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-apa',
          append: function append(_ref2) {
            var volume = _ref2.volume;
            return volume;
          },
          prepend: function prepend(_ref3) {
            var issue = _ref3.issue;
            return issue;
          }
        }, _get2.default.csl.html.wrappedDynamic));
      });
    });
    describe('plain text', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, opts('string', 'string', 'citation-apa'), _get2.default.csl.apa));
      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, opts('string', 'string', 'citation-vancouver'), _get2.default.csl.vancouver));
      describe('non-existent template', testCaseGenerator(data, opts('string', 'string', 'citation-larsgw'), _get2.default.csl.apa));
      describe('non-existent locale', testCaseGenerator(data, opts('string', 'string', 'citation-apa', 'larsgw'), _get2.default.csl.apa));
      describe('custom template', function () {
        _citation.default.CSL.register.addTemplate('custom', customTemplate);

        it('registers the template', function () {
          (0, _expect.default)(_citation.default.CSL.register.hasTemplate('custom')).to.be(true);
          (0, _expect.default)(_citation.default.CSL.register.getTemplate('custom')).to.be(customTemplate);
        });
        testCaseGenerator(data, opts('string', 'string', 'citation-custom'), _get2.default.csl.title)();
      });
      describe('custom locale', function () {
        var data = new _citation.default(_get.default.csl.locale);

        _citation.default.CSL.register.addLocale('custom', customLocale);

        it('registers the locale', function () {
          (0, _expect.default)(_citation.default.CSL.register.hasLocale('custom')).to.be(true);
          (0, _expect.default)(_citation.default.CSL.register.getLocale('custom')).to.be(customLocale);
        });
        testCaseGenerator(data, opts('string', 'string', 'citation-apa', 'custom'), '(custom).')();
      });
    });
  });
  describe('CSL-JSON', function () {
    describe('plain text', testCaseGenerator(data, {
      format: 'string'
    }, _get.default.csl.simple, {
      callback: JSON.parse
    }));
    describe('object', testCaseGenerator(data, undefined, _get.default.csl.simple));
  });
  describe('BibTeX', function () {
    describe('plain text', testCaseGenerator(data, opts('string', 'string', 'bibtex'), _get2.default.bibtex.plain, {
      callback: function callback(v) {
        return v.replace(/\s+/g, ' ');
      }
    }));
    describe('JSON', testCaseGenerator(data, {
      style: 'bibtex'
    }, _get2.default.bibtex.json));
    describe('Bib.TXT', testCaseGenerator(data, opts('string', 'string', 'bibtxt'), _get2.default.bibtex.bibtxt));
  });
  describe('RIS', function () {
    describe('plain text', function () {
      it('outputs correctly', function () {
        (0, _expect.default)(data.format('ris')).to.be(_get2.default.ris.simple);
      });
    });
  });
});

},{"./citation":16,"./input/get":20,"./output/get":23,"expect.js":"expect.js"}],23:[function(require,module,exports){
module.exports={
  "csl": {
    "apa": "Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society, 79(20), 5441–5444. https://doi.org/10.1021/ja01577a030",
    "vancouver": "1. Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 1957 Jan 1;79(20):5441–4.",
    "title": "Correlation of the Base Strengths of Amines 1",
    "html": {
      "apa": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. <i>Journal of the American Chemical Society</i>, <i>79</i>(20), 5441–5444. https://doi.org/10.1021/ja01577a030</div>\n</div>",
      "vancouver": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">\n    <div class=\"csl-left-margin\">1. </div><div class=\"csl-right-inline\">Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 1957 Jan 1;79(20):5441–4.</div>\n   </div>\n</div>",
      "title": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">Correlation of the Base Strengths of Amines 1</div>\n</div>",
      "locale": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"a\" class=\"csl-entry\"> (custom).</div>\n</div>",
      "wrappedStatic": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">aHall, H. K. (1957). Correlation of the Base Strengths of Amines 1. <i>Journal of the American Chemical Society</i>, <i>79</i>(20), 5441–5444. https://doi.org/10.1021/ja01577a030b</div>\n</div>",
      "wrappedDynamic": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">20Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. <i>Journal of the American Chemical Society</i>, <i>79</i>(20), 5441–5444. https://doi.org/10.1021/ja01577a03079</div>\n</div>"
    }
  },
  "bibtex": {
    "plain": "@article{Hall1957Correlation, journal={Journal of the American Chemical Society}, doi={10.1021/ja01577a030}, number=20, title={{Correlation of the Base Strengths of Amines 1}}, volume=79, author={Hall, H. K.}, pages={5441--5444}, date={1957-01-01}, year=1957, month=1, day=1, }",
    "json": [
      {
        "label": "Hall1957Correlation",
        "type": "article",
        "properties": {
          "author": "Hall, H. K.",
          "doi": "10.1021/ja01577a030",
          "journal": "Journal of the American Chemical Society",
          "number": "20",
          "pages": "5441--5444",
          "title": "Correlation of the Base Strengths of Amines 1",
          "volume": "79",
          "date": "1957-01-01",
          "day": "1",
          "month": "1",
          "year": "1957"
        }
      }
    ],
    "bibtxt": "[Hall1957Correlation]\n\tjournal: Journal of the American Chemical Society\n\tdoi: 10.1021/ja01577a030\n\tnumber: 20\n\ttitle: Correlation of the Base Strengths of Amines 1\n\tvolume: 79\n\tauthor: Hall, H. K.\n\tpages: 5441--5444\n\tdate: 1957-01-01\n\tyear: 1957\n\tmonth: 1\n\tday: 1\n\ttype: article"
  },
  "ris": {
    "simple": "TY  - JOUR\nAU  - Hall, H. K.\nDA  - 1957/01/01\nPY  - 1957\nDO  - 10.1021/ja01577a030\nIS  - 20\nSP  - 5441-5444\nT2  - Journal of the American Chemical Society\nTI  - Correlation of the Base Strengths of Amines 1\nVL  - 79\nID  - Q23571040\nER  - \n"
  }
}

},{}],24:[function(require,module,exports){
module.exports={
  "wd": {
    "id": "Q21972834",
    "simple": [
      {
        "_wikiId": "Q21972834",
        "id": "Q21972834",
        "type": "article-journal",
        "title": "Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data",
        "volume": "29",
        "issue": "12",
        "issued": {"date-parts": [[2013, 6, 15]]},
        "page": "1492-7",
        "container-title": "Bioinformatics",
        "PMID": "23698863",
        "PMCID": "3673215",
        "DOI": "10.1093/BIOINFORMATICS/BTT178",
        "author": [
          {"given": "Inanc", "family": "Birol", "_ordinal": 1},
          {"given": "Anthony", "family": "Raymond", "_ordinal": 2},
          {"given": "Shaun D", "family": "Jackman", "_ordinal": 3},
          {"given": "Stephen", "family": "Pleasance", "_ordinal": 4},
          {"given": "Robin", "family": "Coope", "_ordinal": 5},
          {"given": "Greg A", "family": "Taylor", "_ordinal": 6},
          {"given": "Macaire Man Saint", "family": "Yuen", "_ordinal": 7},
          {"given": "Christopher", "family": "Keeling", "_ordinal": 8},
          {"given": "Dana", "family": "Brand", "_ordinal": 9},
          {"given": "Benjamin P", "family": "Vandervalk", "_ordinal": 10},
          {"given": "Heather", "family": "Kirk", "_ordinal": 11},
          {"given": "Pawan", "family": "Pandoh", "_ordinal": 12},
          {"given": "Richard A", "family": "Moore", "_ordinal": 13},
          {"given": "Yongjun", "family": "Zhao", "_ordinal": 14},
          {"given": "Andrew J", "family": "Mungall", "_ordinal": 15},
          {"given": "Barry", "family": "Jaquish", "_ordinal": 16},
          {"given": "Alvin", "family": "Yanchuk", "_ordinal": 17},
          {"given": "Carol", "family": "Ritland", "_ordinal": 18},
          {"given": "Brian", "family": "Boyle", "_ordinal": 19},
          {"given": "Jean", "family": "Bousquet", "_ordinal": 20},
          {"given": "Kermit", "family": "Ritland", "_ordinal": 21},
          {"given": "John", "family": "Mackay", "_ordinal": 22},
          {"given": "Jörg", "family": "Bohlmann", "_ordinal": 23},
          {"given": "Steven J M", "family": "Jones", "_ordinal": 24}
        ]
      }
    ],
    "author": [
      {
        "_wikiId": "Q27795847",
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
        "number-of-pages": 3,
        "container-title": "Nature Biotechnology",
        "URL": "http://rdcu.be/msZj",
        "PMID": "27824832",
        "DOI": "10.1038/NBT.3689",
        "author": [
          {"given": "Gert", "family": "Wohlgemuth", "_ordinal": 1},
          {"given": "Sajjan S", "family": "Mehta", "_ordinal": 2},
          {"given": "Ramon F", "family": "Mejia", "_ordinal": 3},
          {"given": "Steffen", "family": "Neumann", "_ordinal": 4},
          {"given": "Diego", "family": "Pedrosa", "_ordinal": 5},
          {"given": "Tomáš", "family": "Pluskal", "_ordinal": 6},
          {"given": "Emma", "family": "Schymanski", "_ordinal": 7},
          {"given": "Egon", "family": "Willighagen", "_ordinal": 8},
          {"given": "Michael", "family": "Wilson", "_ordinal": 9},
          {"given": "David S", "family": "Wishart", "_ordinal": 10},
          {"given": "Masanori", "family": "Arita", "_ordinal": 11},
          {"given": "Pieter C", "family": "Dorrestein", "_ordinal": 12},
          {"given": "Nuno", "family": "Bandeira", "_ordinal": 13},
          {"given": "Mingxun", "family": "Wang", "_ordinal": 14},
          {"given": "Tobias", "family": "Schulze", "_ordinal": 15},
          {"given": "Reza M", "family": "Salek", "_ordinal": 16},
          {"given": "Christoph", "family": "Steinbeck", "_ordinal": 17},
          {"given": "Venkata Chandrasekhar", "family": "Nainala", "_ordinal": 18},
          {"given": "Robert", "family": "Mistrik", "_ordinal": 19},
          {"given": "Takaaki", "family": "Nishioka", "_ordinal": 20},
          {"given": "Oliver", "family": "Fiehn", "_ordinal": 21}
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
        "citation-label": "Steinbeck2003",
        "PMID": "12653513",
        "type": "article-journal",
        "author": [
          {"given": "Christoph", "family": "Steinbeck"},
          {"given": "Yongquan", "family": "Han"},
          {"given": "Stefan", "family": "Kuhn"},
          {"given": "Oliver", "family": "Horlacher"},
          {"given": "Edgar", "family": "Luttmann"},
          {"given": "Egon", "family": "Willighagen"}
        ],
        "title": "The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.",
        "container-title": "Journal of chemical information and computer sciences",
        "issued": {"date-parts": [["2003"]]},
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
        "citation-label": "Ekstrand:2009:RYD",
        "year-suffix": ":RYD",
        "number-of-pages": "10",
        "type": "paper-conference",
        "author": [
          {"given": "Michael D.", "family": "Ekstrand"},
          {"given": "John T.", "family": "Riedl"}
        ],
        "title": "rv you're dumb: Identifying Discarded Work in Wiki Article History",
        "container-title": "Proceedings of the 5th International Symposium on Wikis and Open Collaboration",
        "collection-title": "WikiSym '09",
        "issued": {"date-parts": [["2009"]]},
        "ISBN": "978-1-60558-730-1",
        "publisher-place": "New York, NY, USA",
        "page": "4:1-4:10",
        "URL": "https://dx.doi.org/10.1145/1641309.1641317",
        "DOI": "10.1145/1641309.1641317",
        "publisher": "ACM",
        "id": "Ekstrand:2009:RYD"
      }
    ],
    "literals": [{
      "citation-label": "b",
      "id": "b",
      "type": "book",
      "author": [
        {"literal": "a and b"},
        {"family": "c"},
        {"given": "D", "family": "E"}
      ],
      "issued": {
        "literal": "13th Century"
      }
    }],
    "yearMonthNeeded": [{
      "citation-label": "b",
      "id": "b",
      "type": "book",
      "issued": {
        "date-parts": [["2017", "8"]]
      }
    }],
    "yearMonth": [{
      "citation-label": "b",
      "id": "b",
      "type": "book",
      "issued": {
        "date-parts": [[2016, 12, 13]]
      }
    }]
  },
  "bibtxt": {
    "author": [
      {"given": "J.W.", "family": "Goethe"}
    ],
    "title": "Faust. Der Tragödie Erster Teil",
    "publisher": "Reclam",
    "issued": {"date-parts": [["1986"]]},
    "publisher-place": "Stuttgart",
    "type": "book",
    "id": "Fau86",
    "citation-label": "Fau86"
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
          {"given": "Leslie Main", "family": "Johnson"}
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

},{}],25:[function(require,module,exports){
require('./async.spec');

require('./cite.spec');

require('./input.spec');

require('./output.spec');

},{"./async.spec":15,"./cite.spec":17,"./input.spec":18,"./output.spec":22}]},{},[25]);
