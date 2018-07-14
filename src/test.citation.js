(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}

function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

  for (var i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
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
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

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

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function get() {
    if (!(this instanceof Buffer)) {
      return undefined;
    }

    return this.buffer;
  }
});
Object.defineProperty(Buffer.prototype, 'offset', {
  get: function get() {
    if (!(this instanceof Buffer)) {
      return undefined;
    }

    return this.byteOffset;
  }
});

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

  if (isArrayBuffer(value) || value && isArrayBuffer(value.buffer)) {
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
    throw new TypeError('"size" argument must be of type number');
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
    throw new TypeError('Unknown encoding: ' + encoding);
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
    throw new RangeError('"offset" is outside of buffer bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds');
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
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }

      return fromArrayLike(obj);
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.');
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

    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf);
    }

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

  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
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

Buffer.prototype.toLocaleString = Buffer.prototype.toString;

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
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
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

  if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');
  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    this.copyWithin(targetStart, start, end);
  } else if (this === target && start < targetStart && targetStart < end) {
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
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

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
        val = code;
      }
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

    if (len === 0) {
      throw new TypeError('The value "' + val + '" is invalid for argument "value"');
    }

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean(str) {
  str = str.split('=')[0];
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

function numberIsNaN(obj) {
  return obj !== obj;
}

},{"base64-js":1,"ieee754":4}],3:[function(require,module,exports){
(function (Buffer){
(function (global, module) {

  var exports = module.exports;

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.3.1';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this;

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          };

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  }

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error, expected) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth
      , err;

    if (!ok) {
      err = new Error(msg.call(this));
      if (arguments.length > 3) {
        err.actual = this.obj;
        err.expected = expected;
        err.showDiff = true;
      }
      throw err;
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Creates an anonymous function which calls fn with arguments.
   *
   * @api public
   */

  Assertion.prototype.withArgs = function() {
    expect(this.obj).to.be.a('function');
    var fn = this.obj;
    var args = Array.prototype.slice.call(arguments);
    return expect(function() { fn.apply(null, args); });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not;

    try {
      this.obj();
    } catch (e) {
      if (isRegExp(fn)) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      } else if ('function' == typeof fn) {
        fn(e);
      }
      thrown = true;
    }

    if (isRegExp(fn) && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(this.obj, obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
      , obj);
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'regexp' == type ? isRegExp(this.obj) :
              'object' == type
                ? 'object' == typeof this.obj && null !== this.obj
                : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };

  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    var error = function() { return msg || "explicit failure"; }
    this.assert(false, error, error);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  }

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    }

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }
      
      // Error objects can be shortcutted
      if (value instanceof Error) {
        return stylize("["+value.toString()+"]", 'Error');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  }

  expect.stringify = i;

  function isArray (ar) {
    return Object.prototype.toString.call(ar) === '[object Array]';
  }

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  }

  function isDate(d) {
    return d instanceof Date;
  }

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  }

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  }

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql(actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

      // 7.2. If the expected value is a Date object, the actual value is
      // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

      // 7.3. Other pairs that do not both pass typeof value == "object",
      // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;
    // If both are regular expression use the special `regExpEquiv` method
    // to determine equivalence.
    } else if (isRegExp(actual) && isRegExp(expected)) {
      return regExpEquiv(actual, expected);
    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  };

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function regExpEquiv (a, b) {
    return a.source === b.source && a.global === b.global &&
           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {exports: {}}
);

}).call(this,require("buffer").Buffer)
},{"buffer":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports={"entities":{"Q21972834":{"pageid":24004990,"ns":0,"title":"Q21972834","lastrevid":594203123,"modified":"2017-11-14T19:42:25Z","type":"item","id":"Q21972834","labels":{"en":{"language":"en","value":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data"},"nl":{"language":"nl","value":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data"}},"descriptions":{"en":{"language":"en","value":"scientific article"},"nl":{"language":"nl","value":"wetenschappelijk artikel (gepubliceerd op 2013/06/15)"},"cs":{"language":"cs","value":"v\u011bdeck\u00fd \u010dl\u00e1nek publikovan\u00fd v roce 2013"},"fr":{"language":"fr","value":"article scientifique (publi\u00e9 2013/06/15)"},"it":{"language":"it","value":"articolo scientifico (pubblicato il 2013/06/15)"},"da":{"language":"da","value":"videnskabelig artikel (udgivet  2013/06/15)"},"sk":{"language":"sk","value":"vedeck\u00fd \u010dl\u00e1nok (publikovan\u00fd 2013/06/15)"},"pt":{"language":"pt","value":"artigo cient\u00edfico (publicado na 2013/06/15)"},"hy":{"language":"hy","value":"\u0563\u056b\u057f\u0561\u056f\u0561\u0576 \u0570\u0578\u0564\u057e\u0561\u056e"},"ar":{"language":"ar","value":"\u0645\u0642\u0627\u0644\u0629 \u0639\u0644\u0645\u064a\u0629 (\u0646\u0634\u0631\u062a \u0641\u064a 15-6-2013)"},"de":{"language":"de","value":"wissenschaftlicher Artikel (ver\u00f6ffentlicht am 15 Juni 2013)"},"sq":{"language":"sq","value":"artikull shkencor"},"ko":{"language":"ko","value":"2013\ub144 \ub17c\ubb38"},"tg-cyrl":{"language":"tg-cyrl","value":"\u043c\u0430\u049b\u043e\u043b\u0430\u0438 \u0438\u043b\u043c\u04e3"},"sr-el":{"language":"sr-el","value":"nau\u010dni \u010dlanak"},"bg":{"language":"bg","value":"\u043d\u0430\u0443\u0447\u043d\u0430 \u0441\u0442\u0430\u0442\u0438\u044f"},"es":{"language":"es","value":"art\u00edculo cient\u00edfico publicado en 2013"},"lt":{"language":"lt","value":"mokslinis straipsnis"},"vi":{"language":"vi","value":"b\u00e0i b\u00e1o khoa h\u1ecdc"},"ru":{"language":"ru","value":"\u043d\u0430\u0443\u0447\u043d\u0430\u044f \u0441\u0442\u0430\u0442\u044c\u044f"},"ast":{"language":"ast","value":"art\u00edculu cient\u00edficu"},"ka":{"language":"ka","value":"\u10e1\u10d0\u10db\u10d4\u10ea\u10dc\u10d8\u10d4\u10e0\u10dd \u10e1\u10e2\u10d0\u10e2\u10d8\u10d0"},"zh-my":{"language":"zh-my","value":"2013\u5e74\u8bba\u6587"},"sr":{"language":"sr","value":"\u043d\u0430\u0443\u0447\u043d\u0438 \u0447\u043b\u0430\u043d\u0430\u043a"},"ca":{"language":"ca","value":"article cient\u00edfic"},"zh-hk":{"language":"zh-hk","value":"2013\u5e74\u8ad6\u6587"},"sr-ec":{"language":"sr-ec","value":"\u043d\u0430\u0443\u0447\u043d\u0438 \u0447\u043b\u0430\u043d\u0430\u043a"},"he":{"language":"he","value":"\u05de\u05d0\u05de\u05e8 \u05de\u05d3\u05e2\u05d9"},"tg":{"language":"tg","value":"\u043c\u0430\u049b\u043e\u043b\u0430\u0438 \u0438\u043b\u043c\u04e3"},"nan":{"language":"nan","value":"2013 n\u00ee l\u016bn-b\u00fbn"},"sv":{"language":"sv","value":"vetenskaplig artikel"},"zh-hant":{"language":"zh-hant","value":"2013\u5e74\u8ad6\u6587"},"eo":{"language":"eo","value":"scienca artikolo"},"yue":{"language":"yue","value":"2013\u5e74\u8ad6\u6587"},"zh-hans":{"language":"zh-hans","value":"2013\u5e74\u8bba\u6587"},"nn":{"language":"nn","value":"vitskapeleg artikkel"},"pt-br":{"language":"pt-br","value":"artigo cient\u00edfico"},"hu":{"language":"hu","value":"tudom\u00e1nyos cikk"},"et":{"language":"et","value":"teaduslik artikkel"},"zh-tw":{"language":"zh-tw","value":"2013\u5e74\u8ad6\u6587"},"oc":{"language":"oc","value":"article scientific"},"el":{"language":"el","value":"\u03b5\u03c0\u03b9\u03c3\u03c4\u03b7\u03bc\u03bf\u03bd\u03b9\u03ba\u03cc \u03ac\u03c1\u03b8\u03c1\u03bf"},"tr":{"language":"tr","value":"bilimsel makale"},"zh-cn":{"language":"zh-cn","value":"2013\u5e74\u8bba\u6587"},"nb":{"language":"nb","value":"vitenskapelig artikkel"},"zh-mo":{"language":"zh-mo","value":"2013\u5e74\u8ad6\u6587"},"gl":{"language":"gl","value":"artigo cient\u00edfico"},"pl":{"language":"pl","value":"artyku\u0142 naukowy"},"th":{"language":"th","value":"\u0e1a\u0e17\u0e04\u0e27\u0e32\u0e21\u0e17\u0e32\u0e07\u0e27\u0e34\u0e17\u0e22\u0e32\u0e28\u0e32\u0e2a\u0e15\u0e23\u0e4c"},"tl":{"language":"tl","value":"artikulong pang-agham"},"ro":{"language":"ro","value":"articol \u0219tiin\u021bific"},"zh-sg":{"language":"zh-sg","value":"2013\u5e74\u8bba\u6587"},"uk":{"language":"uk","value":"\u043d\u0430\u0443\u043a\u043e\u0432\u0430 \u0441\u0442\u0430\u0442\u0442\u044f"},"zh":{"language":"zh","value":"2013\u5e74\u8bba\u6587"},"ja":{"language":"ja","value":"2013\u5e74\u306e\u8ad6\u6587"},"wuu":{"language":"wuu","value":"2013\u5e74\u8bba\u6587"},"fi":{"language":"fi","value":"tieteellinen artikkeli"}},"aliases":[],"claims":{"P698":[{"mainsnak":{"snaktype":"value","property":"P698","datavalue":{"value":"23698863","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$D435A2F3-E2A8-45A7-922A-A6BB72F9A79C","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P932":[{"mainsnak":{"snaktype":"value","property":"P932","datavalue":{"value":"3673215","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$F4959183-FB89-410E-BF33-DF9B1AF81ECE","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P31":[{"mainsnak":{"snaktype":"value","property":"P31","datavalue":{"value":{"entity-type":"item","numeric-id":13442814,"id":"Q13442814"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$E4DCC072-BD1A-4FDF-BFED-E1D981E5E81F","rank":"normal"}],"P1476":[{"mainsnak":{"snaktype":"value","property":"P1476","datavalue":{"value":{"text":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q21972834$D8C2FFB6-2710-4AFA-92A3-A859ABAA1FED","rank":"normal"}],"P478":[{"mainsnak":{"snaktype":"value","property":"P478","datavalue":{"value":"29","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$963935D7-041A-4E92-9D9B-F254A5426BAD","rank":"normal"}],"P433":[{"mainsnak":{"snaktype":"value","property":"P433","datavalue":{"value":"12","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$47B925A9-A53F-43A3-888D-BEA79E399D4D","rank":"normal"}],"P577":[{"mainsnak":{"snaktype":"value","property":"P577","datavalue":{"value":{"time":"+2013-06-15T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"},"type":"statement","id":"Q21972834$9EDE475C-7403-4A66-A6A5-0458E7782689","rank":"normal"}],"P304":[{"mainsnak":{"snaktype":"value","property":"P304","datavalue":{"value":"1492-7","type":"string"},"datatype":"string"},"type":"statement","id":"Q21972834$92D5DD57-B5F0-42B6-9508-6D5CEB82FF3C","rank":"normal"}],"P2093":[{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Anthony Raymond","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"7241753c62a310cf84895620ea82250dcea65835","datavalue":{"value":"2","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$BC54A9F8-68FF-4F6E-8111-A449A15BDB57","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Shaun D Jackman","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"0e979f28bf306fefdcd352b4eb8dee5da2153a6d","datavalue":{"value":"3","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CB76DCFD-DA2A-4673-ACDB-B8CA71D1069C","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Stephen Pleasance","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"cbff8d4b3b7b35f905ef3147a7a6cb88845a774f","datavalue":{"value":"4","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$CC360BCE-0D0D-4E92-8F68-1780D1106620","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Robin Coope","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ea4583c18f699186700d21642b477a2dc1d345c8","datavalue":{"value":"5","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$EC1B7589-BE7F-450C-B4AE-978EF4440682","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Greg A Taylor","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"32387bd293902a2430b5bb680033d36ecea00dd0","datavalue":{"value":"6","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$AA1A005B-0985-4CCB-AB13-782A3385EB54","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Macaire Man Saint Yuen","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"9a4403310d2d27312d0a93830981a1e51b735843","datavalue":{"value":"7","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$A0812623-AA81-48CB-AA51-1E04CCC21FE9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Dana Brand","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a9a9c98c803f52f2debc2c74270b3bd0c1f753d9","datavalue":{"value":"9","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$6A62350D-4505-43DF-A8D4-719B8282ED8E","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Benjamin P Vandervalk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"51210afb13f62d7537a51c61ba9b9586db143c24","datavalue":{"value":"10","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$B78884CC-1F88-45B1-B1B3-DD9DDF2B2FBE","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Heather Kirk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"4fda4e2a606f90da339710b3368ca24eb2d05ec1","datavalue":{"value":"11","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$C9117C71-EAEB-4DC0-909B-9876C53A3802","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Pawan Pandoh","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"b1425a27074b51abb46a9cb949eb37d115c2204a","datavalue":{"value":"12","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$22C57E2F-6C2C-46DC-B184-0CA7F529B6C3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Richard A Moore","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f156fb34fcce34ed7b7ab814d08b4f127f7d0c0a","datavalue":{"value":"13","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$C86DCED7-41A0-4653-9E9F-AEDD1BB5392C","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Yongjun Zhao","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"2c80382503f2260434d0a61f856e7202ac2ef14e","datavalue":{"value":"14","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$507B8D2B-1EA4-492D-93E8-3D9236BDECB7","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Andrew J Mungall","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"1c30b5edfe37c20fba82e77d50973f05e0b11f6f","datavalue":{"value":"15","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$99499BC4-F219-4E8E-B79C-0FFC4AF1919F","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Barry Jaquish","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"fad4d36a0de768e4b914ae40a3ab93ff76802562","datavalue":{"value":"16","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$2A452CB5-1392-48A3-8BDF-C3859ECD2CD7","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Alvin Yanchuk","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"1486eb16323ccfa872de81f5a62795658dfa8c93","datavalue":{"value":"17","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$ED126A91-2089-4B3C-8BB6-D7FE81E05C63","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Brian Boyle","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a37679c5dba91ad0c4813c3c62af8ac5d2a1e00d","datavalue":{"value":"19","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$9D020847-DAD2-4573-8896-C6826BEBB4DD","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Jean Bousquet","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"56e77a2eea22fa436528789b1e88f73ebce53a92","datavalue":{"value":"20","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$76CDF015-D56A-4539-9A29-ED6328566BA9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"John Mackay","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f5a226ebb11ff3cb8c41370357acdc8ede4a3224","datavalue":{"value":"22","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$382410E5-912A-4D08-BEA6-238379D5BA61","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Steven J M Jones","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"0f81c461e0edbb9c5613e6b49511d44fefcaeec1","datavalue":{"value":"24","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$E584D000-D3FA-48EB-B0B6-18A64D489469","rank":"normal"}],"P2860":[{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21183990,"id":"Q21183990"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$067675E1-BE45-48EC-9927-9B505DCD2C38","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22065964,"id":"Q22065964"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$B272C2D7-F0C1-4B7E-B5F0-ADBD60D235EB","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24629733,"id":"Q24629733"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$85D12800-291A-4885-8DDE-42657DE6E026","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24625559,"id":"Q24625559"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$EA35C15C-3F08-41DE-A369-06B084B6BAA3","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22122211,"id":"Q22122211"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$9F920256-4000-405C-AACB-E96C6D992603","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21183889,"id":"Q21183889"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8F12AA50-1D1B-42C6-B6AD-E9A9587F53EB","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21261967,"id":"Q21261967"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$A4899485-8489-4D70-82E7-82C216106962","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24807126,"id":"Q24807126"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$FD2F304E-61D2-41EE-8AB5-B5CA1267B7CB","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21045365,"id":"Q21045365"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$113AD736-4A2B-479D-BA9D-0615FEA01A84","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22122143,"id":"Q22122143"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$16FE34E1-5AAC-4D98-898A-7CC4699861F0","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":22065842,"id":"Q22065842"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$A0BF94ED-B679-4A17-B68A-2FE7AF6858AA","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":25938991,"id":"Q25938991"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$513BAA39-8D82-4485-A25D-DB222C90B284","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27860816,"id":"Q27860816"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$DD899F96-5D71-4BBC-A87E-B710B870C6C3","rank":"normal","references":[{"hash":"c3f3095725ed8dbca34582aaaebbf0ff4e5473bd","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-03-19T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":29547263,"id":"Q29547263"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$6841DAE3-4A88-426D-878D-A8320B56F389","rank":"normal","references":[{"hash":"027d43a2f0e454d327c064532b8169344ca9c479","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-04-07T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":29547486,"id":"Q29547486"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8DB197DA-99D5-436F-AA57-3553E59F0575","rank":"normal","references":[{"hash":"027d43a2f0e454d327c064532b8169344ca9c479","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-04-07T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":36601316,"id":"Q36601316"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$483D0AAB-8A16-494B-96F5-A507460BD5D5","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34543255,"id":"Q34543255"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$65364437-C75A-45F4-8907-482D125C66CA","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34533338,"id":"Q34533338"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$BC4B4E8C-F714-45CF-8C05-7980AAECB044","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34350757,"id":"Q34350757"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$DD7EB85B-9B3D-4BF7-B704-64759D231C5F","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34251827,"id":"Q34251827"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$76315A27-AE66-4137-8B5F-183097F5425E","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34241401,"id":"Q34241401"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$8F4EC1C1-A1EF-48C5-9367-BDB40377B74D","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":35362616,"id":"Q35362616"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$B56DF036-3F98-4EDE-AB53-E10D182E3006","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34217144,"id":"Q34217144"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$66B679B2-45E4-41A3-B97A-D42C704DAD1F","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":34020907,"id":"Q34020907"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$0D0FA045-842B-4ADB-B6A7-AD2ABE53B112","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":33375873,"id":"Q33375873"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$E78669A8-D271-4542-8540-8BC00D59B227","rank":"normal","references":[{"hash":"58fd59bd76c326e470647556ebc287113579967f","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-12T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":41000676,"id":"Q41000676"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$75EBD061-E902-4A52-B985-DF80811A7613","rank":"normal","references":[{"hash":"573e725ddbb0ec0ba9390fd06f5ca02d8842d7fa","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":229883,"id":"Q229883"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P854":[{"snaktype":"value","property":"P854","datavalue":{"value":"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&retmode=json&id=3673215","type":"string"},"datatype":"url"}],"P813":[{"snaktype":"value","property":"P813","datavalue":{"value":{"time":"+2017-09-27T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"}]},"snaks-order":["P248","P854","P813"]}]}],"P1433":[{"mainsnak":{"snaktype":"value","property":"P1433","datavalue":{"value":{"entity-type":"item","numeric-id":4914910,"id":"Q4914910"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$72BB933D-4685-4F38-AE7C-1FBB71952A69","rank":"normal","references":[{"hash":"0f777b69d8d3a65ccde0a935ad2e100b32e54ef9","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":180686,"id":"Q180686"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"snaks-order":["P248"]}]}],"P3181":[{"mainsnak":{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$FDDF4A83-6970-4A50-8A59-26DFA5C2621C","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P921":[{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":128116,"id":"Q128116"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$e8eae0f3-4581-47f5-9528-04c967854423","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":1073526,"id":"Q1073526"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$64a4a2b9-4d01-0532-bfd4-605bd9484f3c","rank":"normal"}],"P356":[{"mainsnak":{"snaktype":"value","property":"P356","datavalue":{"value":"10.1093/BIOINFORMATICS/BTT178","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q21972834$2FB0F783-8FE0-4E40-9080-7CD9DBD6906B","rank":"normal","references":[{"hash":"9581e8725c1608f503d588ed3a6e01d95b185b23","snaks":{"P248":[{"snaktype":"value","property":"P248","datavalue":{"value":{"entity-type":"item","numeric-id":30068043,"id":"Q30068043"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P3181":[{"snaktype":"value","property":"P3181","datavalue":{"value":"475928","type":"string"},"datatype":"external-id"}]},"snaks-order":["P248","P3181"]}]}],"P50":[{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984952,"id":"Q32984952"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a921621b61855fb454e1096de9b0fc91b21bfa9b","datavalue":{"value":"23","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$F3B493D0-A576-4959-8950-6D43D7995CC4","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984953,"id":"Q32984953"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"9d22b928e2a536181e7576da40198990b72f9197","datavalue":{"value":"21","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$27A38427-E938-4631-A0F4-7992D282E8F9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984954,"id":"Q32984954"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"618cb6a0b47e3e935e91ad6a5bd476a8d3f4fb33","datavalue":{"value":"18","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$9283F501-FB54-42BB-A504-3F07A499867F","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":32984957,"id":"Q32984957"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"2a1ced1dca90648ea7e306acbadd74fc81a10722","datavalue":{"value":"1","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q21972834$95E03FEE-E787-429D-A330-63D5AA1A4538","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":43147587,"id":"Q43147587"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"94d4f77373c2051829a238495246b458b7737ef9","datavalue":{"value":"8","type":"string"},"datatype":"string"}],"P1932":[{"snaktype":"value","property":"P1932","hash":"6530fee4ffabeab260a77bf78146abde9523a870","datavalue":{"value":"Christopher I Keeling","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545","P1932"],"id":"Q21972834$1F045850-DBC8-46DE-B6FA-C0AA8BF25B3C","rank":"normal"}],"P407":[{"mainsnak":{"snaktype":"value","property":"P407","datavalue":{"value":{"entity-type":"item","numeric-id":1860,"id":"Q1860"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q21972834$785E0AE5-4741-443B-B8F2-039E4F1935A4","rank":"normal"}]},"sitelinks":[]}}}
},{}],6:[function(require,module,exports){
module.exports={"entities":{"Q27795847":{"pageid":29511090,"ns":0,"title":"Q27795847","lastrevid":453265099,"modified":"2017-02-20T20:13:32Z","type":"item","id":"Q27795847","labels":{"en":{"language":"en","value":"SPLASH, a hashed identifier for mass spectra"},"nl":{"language":"nl","value":"SPLASH, a hashed identifier for mass spectra"}},"descriptions":{"fr":{"language":"fr","value":"article scientifique (publi\u00e9 2016/11/08)"},"cs":{"language":"cs","value":"v\u011bdeck\u00fd \u010dl\u00e1nek publikovan\u00fd v roce 2016"},"nl":{"language":"nl","value":"wetenschappelijk artikel (gepubliceerd op 2016/11/08)"},"it":{"language":"it","value":"articolo scientifico (pubblicato il 2016/11/08)"},"sk":{"language":"sk","value":"vedeck\u00fd \u010dl\u00e1nok (publikovan\u00fd 2016/11/08)"},"da":{"language":"da","value":"videnskabelig artikel (udgivet  2016/11/08)"},"pt":{"language":"pt","value":"artigo cient\u00edfico (publicado na 2016/11/08)"},"en":{"language":"en","value":"scientific article"},"hy":{"language":"hy","value":"\u0563\u056b\u057f\u0561\u056f\u0561\u0576 \u0570\u0578\u0564\u057e\u0561\u056e"}},"aliases":[],"claims":{"P31":[{"mainsnak":{"snaktype":"value","property":"P31","datavalue":{"value":{"entity-type":"item","numeric-id":13442814,"id":"Q13442814"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$FE0E533D-7E2D-4FC1-AB73-22196E9D9455","rank":"normal"}],"P577":[{"mainsnak":{"snaktype":"value","property":"P577","datavalue":{"value":{"time":"+2016-11-08T00:00:00Z","timezone":0,"before":0,"after":0,"precision":11,"calendarmodel":"http://www.wikidata.org/entity/Q1985727"},"type":"time"},"datatype":"time"},"type":"statement","id":"Q27795847$7695c7e8-4988-843f-d638-1a765f6bd0f1","rank":"normal"}],"P1476":[{"mainsnak":{"snaktype":"value","property":"P1476","datavalue":{"value":{"text":"SPLASH, a hashed identifier for mass spectra","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q27795847$c12e8199-4e9b-8d86-1f89-c53255e1b89f","rank":"normal"}],"P2093":[{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Gert Wohlgemuth","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"862c83ca2949d7eb8f41b4bf1a4521ed18cdebb8","datavalue":{"value":"1","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"17f7c88944bcd21a5b1de89be8babd7895377505","datavalue":{"value":{"entity-type":"item","numeric-id":129421,"id":"Q129421"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$5a37a217-4790-7488-341c-3f40aac679d5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Sajjan S Mehta","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"af1310a34ec80620d4fdd7bb8ca76e492fe6630e","datavalue":{"value":"2","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$e029413e-465a-6e7f-bbc4-7bf7d095bdf5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Ramon F Mejia","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"3c1e388cba3487113121af5bfa59a2f657bf21bd","datavalue":{"value":"3","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$459a6034-4de2-d02c-71b3-de0d009d3ca0","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Diego Pedrosa","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c8e1b85012703eb0f44ff876ec773596f3794872","datavalue":{"value":"5","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$27938ccf-4c1f-0fdc-5250-8c9b7ab1ab0c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Tom\u00e1\u0161 Pluskal","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5d30572c5a5693878a66231c29c9bb3e4a870527","datavalue":{"value":"6","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"a47de0d3aa3e3d2844ebf22e9624c4efb47ccbdd","datavalue":{"value":{"entity-type":"item","numeric-id":825987,"id":"Q825987"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$4414bb01-4540-a5d2-bb41-78cee294f865","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Michael Wilson","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ebbb7b4bd5f12eaa0eb9415b51fd725fd993a644","datavalue":{"value":"9","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$b76ba909-4412-7b4b-1b29-acc6b19a31c3","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Masanori Arita","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"938c75f8b1bafb9e19a4c1a079b8b8e5d997c7fa","datavalue":{"value":"11","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"6f8ef5a2bbb33916e6b5870a7274e8730efa1f21","datavalue":{"value":{"entity-type":"item","numeric-id":1153275,"id":"Q1153275"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$f55f9709-47c0-879a-80ee-468a59ee7993","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Pieter C Dorrestein","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"472f0889b6914293dcbc4d0f62bb3e3ce6d37ce0","datavalue":{"value":"12","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$8c511a6b-4213-8d9d-ed2c-61261d710ca9","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Nuno Bandeira","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a0d6d71b9401a527331dc2a8a59c54448b5ad98c","datavalue":{"value":"13","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$84869301-4041-a4b4-3496-f0f724c03ac5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Mingxun Wang","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"89d1857be00646d34838dc372e42882e3e20dca2","datavalue":{"value":"14","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"777bee7b0612da6cfca8a663b6c60ffdbed72f98","datavalue":{"value":{"entity-type":"item","numeric-id":622664,"id":"Q622664"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$d1287f99-4e2f-c26a-2257-1fa71a5f9b67","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Tobias Schulze","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"502af995394385a6c11fd2f00b65598853ceedc5","datavalue":{"value":"15","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$05d35d06-4164-b410-d163-7228c8a6bacf","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Reza M Salek","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"f83c26be8edcec43a735fc3c85792c85d186a3c0","datavalue":{"value":"16","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$975616fd-41c1-5797-f792-16d317d4e17c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Venkata Chandrasekhar Nainala","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c5201cb20b41dc2f0e2cf1361e16829d4cfbeac8","datavalue":{"value":"18","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$68c00f70-40f7-52ac-6b51-27340aee5757","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Robert Mistrik","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"5ffccd25ee75ecddecb8ccbb1a59226cc3ba535a","datavalue":{"value":"19","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$7e774c4a-41f4-c0c9-b0ee-391e74a772dd","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2093","datavalue":{"value":"Takaaki Nishioka","type":"string"},"datatype":"string"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"481220fb9e6317d9e822186cb47365497d25e036","datavalue":{"value":"20","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$8d8845f3-44c5-b259-8aea-b55827411fdc","rank":"normal"}],"P478":[{"mainsnak":{"snaktype":"value","property":"P478","datavalue":{"value":"34","type":"string"},"datatype":"string"},"type":"statement","id":"Q27795847$a090a3aa-4a02-fbe5-9aca-df819f80e84c","rank":"normal"}],"P304":[{"mainsnak":{"snaktype":"value","property":"P304","datavalue":{"value":"1099\u20131101","type":"string"},"datatype":"string"},"type":"statement","id":"Q27795847$9ec79308-4361-58b7-2219-df398124c52e","rank":"normal"}],"P1433":[{"mainsnak":{"snaktype":"value","property":"P1433","datavalue":{"value":{"entity-type":"item","numeric-id":1893837,"id":"Q1893837"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b771b8e8-4ccd-82d8-02e0-df734ad9b35b","rank":"normal"}],"P921":[{"mainsnak":{"snaktype":"value","property":"P921","datavalue":{"value":{"entity-type":"item","numeric-id":12149006,"id":"Q12149006"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b4edba31-4e22-d1d0-60fd-8e7a4258a3a4","rank":"normal"}],"P50":[{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":5111731,"id":"Q5111731"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a89a718f20b227073f3b4f3aa4ad0e99ba77b542","datavalue":{"value":"17","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"3c814103e8488af45c5f9ddb4f3a83548284f46a","datavalue":{"value":{"entity-type":"item","numeric-id":1341845,"id":"Q1341845"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$cfda0f9e-40ab-fe07-d2c1-a646a2588c34","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":20895241,"id":"Q20895241"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"c6a0d2bbafefdc6d21b25af4357c9887085c2f89","datavalue":{"value":"8","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"f3f4b1106be9c9432af1675a98182889725faf11","datavalue":{"value":{"entity-type":"item","numeric-id":19845644,"id":"Q19845644"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}],"P1932":[{"snaktype":"value","property":"P1932","hash":"f897727ae72d779987cc1cbb9f667d3e7c74a0c2","datavalue":{"value":"Egon L Willighagen","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545","P1416","P1932"],"id":"Q27795847$4a94239d-4f1b-77a8-41b6-2c04e1f5a079","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":27863244,"id":"Q27863244"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"ecdcd65e6c9f103dedc06d856ce957af15050f7b","datavalue":{"value":"7","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"2af45dffb1e796266913f5fecff0b01fb42a2142","datavalue":{"value":{"entity-type":"item","numeric-id":678765,"id":"Q678765"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$85eb14b2-4d1e-fbaa-ce18-7b92398da5d5","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":27887604,"id":"Q27887604"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"6d824c4548dc9c84054b9e446b8ea72e50efebba","datavalue":{"value":"10","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"072d0bc1ba7876a9edfe9766e4dd2c83d759f3e6","datavalue":{"value":{"entity-type":"item","numeric-id":640694,"id":"Q640694"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$34c7ffad-48b7-582d-aee0-04e6694250fb","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":28540892,"id":"Q28540892"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a39223fc722bb1c9ca54fe188d9596d0c68f055e","datavalue":{"value":"21","type":"string"},"datatype":"string"}],"P1416":[{"snaktype":"value","property":"P1416","hash":"17f7c88944bcd21a5b1de89be8babd7895377505","datavalue":{"value":{"entity-type":"item","numeric-id":129421,"id":"Q129421"},"type":"wikibase-entityid"},"datatype":"wikibase-item"}]},"qualifiers-order":["P1545","P1416"],"id":"Q27795847$990b9ecd-4746-5ebc-2209-510172d627f2","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P50","datavalue":{"value":{"entity-type":"item","numeric-id":28541023,"id":"Q28541023"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1545":[{"snaktype":"value","property":"P1545","hash":"a82b0aa3ccf1a266e15473824b4391f6d9da4be0","datavalue":{"value":"4","type":"string"},"datatype":"string"}]},"qualifiers-order":["P1545"],"id":"Q27795847$a9af48e3-4afb-4281-1b0b-7c8405afd325","rank":"normal"}],"P2860":[{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21093640,"id":"Q21093640"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$51189732-4cae-29ac-9c3d-5f52e4076684","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807487,"id":"Q27807487"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$b3a68adf-4629-432a-a2fe-c5afb5d478a0","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807488,"id":"Q27807488"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$25db773a-4265-1451-58ff-d9a8d0fc2c90","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27136473,"id":"Q27136473"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$906aa8f9-4163-5c7c-c17e-7a83329babee","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807490,"id":"Q27807490"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$6a239bbf-4e74-5eb1-dd40-1bd734e00dad","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807493,"id":"Q27807493"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$a6aaa6b6-4fab-6667-4347-08af84b83958","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807494,"id":"Q27807494"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$6e77205b-4fea-719e-237e-323ffdc5de53","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27807496,"id":"Q27807496"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$fd046765-4ec1-4773-dbc4-adb5a2d43490","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27809667,"id":"Q27809667"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$13ecb48e-49bf-5c2c-81a7-dcbc953f46fc","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818844,"id":"Q27818844"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$9569723d-4d9b-05ad-dfaa-f0be798cc8e4","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":24595162,"id":"Q24595162"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$8a414bd4-4676-dfa6-70bf-2cc8ffdfdb9c","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818909,"id":"Q27818909"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$ef170bc8-4a44-e40b-209c-9fad35846433","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818910,"id":"Q27818910"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$e101201a-4092-253b-ea90-80b52d65e153","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21030547,"id":"Q21030547"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$39288916-4bcc-bb5d-6165-a3e7d8557230","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":21146620,"id":"Q21146620"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$1e9ee22e-4181-0f42-3bac-8b6bf7325ddc","rank":"normal"},{"mainsnak":{"snaktype":"value","property":"P2860","datavalue":{"value":{"entity-type":"item","numeric-id":27818912,"id":"Q27818912"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","id":"Q27795847$15ec6ec7-4db2-3bbb-bfaf-a924b6482e51","rank":"normal"}],"P1104":[{"mainsnak":{"snaktype":"value","property":"P1104","datavalue":{"value":{"amount":"+3","unit":"1","upperBound":"+4","lowerBound":"+2"},"type":"quantity"},"datatype":"quantity"},"type":"statement","id":"Q27795847$be33113d-4b0c-7756-ecf1-ec78c0605209","rank":"normal"}],"P953":[{"mainsnak":{"snaktype":"value","property":"P953","datavalue":{"value":"http://rdcu.be/msZj","type":"string"},"datatype":"url"},"type":"statement","id":"Q27795847$9ae54b43-42bd-2c08-9347-eecb6838ae00","rank":"normal"}],"P698":[{"mainsnak":{"snaktype":"value","property":"P698","datavalue":{"value":"27824832","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q27795847$7CCFB068-30E5-4A85-A1AA-85981F7752E8","rank":"normal"}],"P356":[{"mainsnak":{"snaktype":"value","property":"P356","datavalue":{"value":"10.1038/NBT.3689","type":"string"},"datatype":"external-id"},"type":"statement","id":"Q27795847$BDC0D3CE-51FB-4058-B1AE-BD9CF1DCB5DE","rank":"normal"}]},"sitelinks":[]}}}
},{}],7:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _parse = _interopRequireDefault(require("./input/parse"));

var _parse2 = _interopRequireDefault(require("./output/parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

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

},{"./citation":8,"./input/parse":13,"./output/parse":16,"expect.js":3}],8:[function(require,module,exports){
"use strict";

module.exports = require('citation-js');

},{"citation-js":undefined}],9:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _cite = _interopRequireDefault(require("./input/cite"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
          lang: '1'
        });
        (0, _expect.default)(test._options.lang).to.be('1');
        (0, _expect.default)(test.log).to.have.length(1);
      });
      it('saves', function () {
        test.options({
          lang: '2'
        }, true);
        (0, _expect.default)(test._options.lang).to.be('2');
        (0, _expect.default)(test.log).to.have.length(2);
      });
      it('validates', function () {
        test.options({
          format: 'real'
        });
        test.options({
          format: 'foo'
        });
        (0, _expect.default)(test._options.format).to.be('real');
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

},{"./citation":8,"./input/cite":11,"expect.js":3}],10:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

var _parse = _interopRequireDefault(require("./input/parse"));

var _parse2 = _interopRequireDefault(require("./output/parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_parse.default.wd.simple = require('./Q21972834.json');
_parse.default.wd.author = require('./Q27795847.json');
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
    'with unicode and capitalized types': [_parse.default.bibtex.unicode, [_parse2.default.bibtex.unicode]],
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
  '@bibjson/quickscrape+record+object': [_parse.default.bibjson.quickscrape, _parse2.default.bibjson.quickscrape],
  '@bibjson/record+object': [_parse.default.bibjson.simple, _parse2.default.bibjson.simple],
  '@else/json': {
    'as JSON string': [JSON.stringify(_parse.default.csl.simple), [_parse.default.csl.simple]],
    'as JS Object string': [_parse.default.csl.string, [_parse.default.csl.simple]],
    'with a syntax error': ['{"hi"}', []]
  },
  '@empty/text': ['', []],
  '@empty/whitespace+text': ['   \t\n \r  ', []],
  '@empty': {
    '(null)': [null, []],
    '(undefined)': [undefined, []]
  },
  '@invalid': ['anything not covered by the parsers above', []],
  '@csl/object': {
    'with no properties': [{}, [{}]],
    'with nonsense properties': [{
      a: 1
    }, [{
      a: 1
    }]],
    'with proper properties': [{
      title: 'test'
    }, [{
      title: 'test'
    }]]
  },
  '@csl/list+object': {
    'without elements': [[], [], {
      link: true
    }],
    'with elements': [[{}], [{}], {
      link: true
    }]
  },
  '@else/list+object': [[[{
    i: 1
  }], [{
    i: 2
  }, [{
    i: 3
  }]], {
    i: 4
  }], [{
    i: 1
  }, {
    i: 2
  }, {
    i: 3
  }, {
    i: 4
  }]]
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
  describe('modules', function () {
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
  describe('date parser', function () {
    var parse = _citation.default.parse.date;
    describe('epoch time', function () {
      it('works', function () {
        (0, _expect.default)(parse(0)).to.eql({
          'date-parts': [[1970, 1, 1]]
        });
        (0, _expect.default)(parse(1500000000000)).to.eql({
          'date-parts': [[2017, 7, 14]]
        });
      });
      it('ignores non-numerical values', function () {
        (0, _expect.default)(parse('1500000000000')).not.to.eql({
          'date-parts': [[2017, 7, 14]]
        });
      });
    });
    describe('ISO-8601 time', function () {
      it('works for short dates', function () {
        (0, _expect.default)(parse('0000-01-01')).to.eql({
          'date-parts': [[0, 1, 1]]
        });
        (0, _expect.default)(parse('2000-01-01')).to.eql({
          'date-parts': [[2000, 1, 1]]
        });
        (0, _expect.default)(parse('9999-01-01')).to.eql({
          'date-parts': [[9999, 1, 1]]
        });
      });
      it('works for long dates', function () {
        (0, _expect.default)(parse('000000-01-01')).to.eql({
          'date-parts': [[0, 1, 1]]
        });
        (0, _expect.default)(parse('002000-01-01')).to.eql({
          'date-parts': [[2000, 1, 1]]
        });
        (0, _expect.default)(parse('200000-01-01')).to.eql({
          'date-parts': [[200000, 1, 1]]
        });
        (0, _expect.default)(parse('+002000-01-01')).to.eql({
          'date-parts': [[2000, 1, 1]]
        });
        (0, _expect.default)(parse('-002000-01-01')).to.eql({
          'date-parts': [[-2000, 1, 1]]
        });
      });
      it('works for super long dates', function () {
        (0, _expect.default)(parse("".concat(13e7, "-01-01"))).to.eql({
          'date-parts': [[13e7, 1, 1]]
        });
      });
      it('disregards time values', function () {
        (0, _expect.default)(parse('2000-01-01T20:20:20')).to.eql({
          'date-parts': [[2000, 1, 1]]
        });
      });
      it('works for different precisions', function () {
        (0, _expect.default)(parse('2000-01-01')).to.eql({
          'date-parts': [[2000, 1, 1]]
        });
        (0, _expect.default)(parse('2000-01-00')).to.eql({
          'date-parts': [[2000, 1]]
        });
        (0, _expect.default)(parse('2000-00-00')).to.eql({
          'date-parts': [[2000]]
        });
      });
    });
    describe('RFC-2822 time', function () {
      it('works', function () {
        (0, _expect.default)(parse('1 Jan 0000')).to.eql({
          'date-parts': [[0, 1, 1]]
        });
        (0, _expect.default)(parse('5 Feb 2000')).to.eql({
          'date-parts': [[2000, 2, 5]]
        });
        (0, _expect.default)(parse('12 Mar 20001')).to.eql({
          'date-parts': [[20001, 3, 12]]
        });
      });
      it('works with week days', function () {
        (0, _expect.default)(parse('Tue, 23 May 0000')).to.eql({
          'date-parts': [[0, 5, 23]]
        });
        (0, _expect.default)(parse('Fri, 13 Apr 2001')).to.eql({
          'date-parts': [[2001, 4, 13]]
        });
        (0, _expect.default)(parse('Wed, 30 Jun 20001')).to.eql({
          'date-parts': [[20001, 6, 30]]
        });
      });
      it('disregards time values', function () {
        (0, _expect.default)(parse('Sat, 1 Jan 2000 20h20m20s')).to.eql({
          'date-parts': [[2000, 1, 1]]
        });
      });
    });
    describe('non-standard time', function () {
      describe('with day-precision', function () {
        it('works', function () {
          (0, _expect.default)(parse('1 1 2000')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('1 Jan 2000')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('01 01 2000')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('01 Jan 2000')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('1 1 -2000')).to.eql({
            'date-parts': [[-2000, 1, 1]]
          });
          (0, _expect.default)(parse('1 Jan -2000')).to.eql({
            'date-parts': [[-2000, 1, 1]]
          });
        });
        it('works reversed', function () {
          (0, _expect.default)(parse('2000 1 1')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('2000 Jan 1')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('2000 01 01')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('2000 Jan 01')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
          (0, _expect.default)(parse('-2000 1 1')).to.eql({
            'date-parts': [[-2000, 1, 1]]
          });
          (0, _expect.default)(parse('-2000 Jan 1')).to.eql({
            'date-parts': [[-2000, 1, 1]]
          });
        });
        it('disregards time values', function () {
          (0, _expect.default)(parse('2000.01.01 20:20:20')).to.eql({
            'date-parts': [[2000, 1, 1]]
          });
        });
        context('and different separators like', function () {
          it('"." work', function () {
            (0, _expect.default)(parse('1.1.2000')).to.eql({
              'date-parts': [[2000, 1, 1]]
            });
          });
          it('"-" work', function () {
            (0, _expect.default)(parse('1-1-2000')).to.eql({
              'date-parts': [[2000, 1, 1]]
            });
          });
          it('"/" work', function () {
            (0, _expect.default)(parse('1/1/2000')).to.eql({
              'date-parts': [[2000, 1, 1]]
            });
          });
        });
        context('and American formatting', function () {
          it('works', function () {
            (0, _expect.default)(parse('5/2/2000')).to.eql({
              'date-parts': [[2000, 5, 2]]
            });
            (0, _expect.default)(parse('5/2/20')).to.eql({
              'date-parts': [[20, 5, 2]]
            });
          });
          it('ignores invalid dates', function () {
            (0, _expect.default)(parse('30/5/2000')).to.eql({
              'date-parts': [[2000, 5, 30]]
            });
          });
          it('ignores dates with other separators', function () {
            (0, _expect.default)(parse('5 2 2000')).not.to.eql({
              'date-parts': [[2000, 5, 2]]
            });
          });
          it('disregards time values', function () {
            (0, _expect.default)(parse('1/1/2000 20:20:20')).to.eql({
              'date-parts': [[2000, 1, 1]]
            });
          });
        });
      });
      describe('with month-precision', function () {
        it('works', function () {
          (0, _expect.default)(parse('Jan 2000')).to.eql({
            'date-parts': [[2000, 1]]
          });
          (0, _expect.default)(parse('2000 Jan')).to.eql({
            'date-parts': [[2000, 1]]
          });
          (0, _expect.default)(parse('January 2000')).to.eql({
            'date-parts': [[2000, 1]]
          });
          (0, _expect.default)(parse('Jan -2000')).to.eql({
            'date-parts': [[-2000, 1]]
          });
          (0, _expect.default)(parse('-2000 Jan')).to.eql({
            'date-parts': [[-2000, 1]]
          });
        });
        it('works when both values are numbers', function () {
          (0, _expect.default)(parse('1 2000')).to.eql({
            'date-parts': [[2000, 1]]
          });
          (0, _expect.default)(parse('2000 1')).to.eql({
            'date-parts': [[2000, 1]]
          });
        });
        it('works when one value is negative', function () {
          (0, _expect.default)(parse('1 -2000')).to.eql({
            'date-parts': [[-2000, 1]]
          });
          (0, _expect.default)(parse('-2000 1')).to.eql({
            'date-parts': [[-2000, 1]]
          });
        });
        it('defaults to MM YY', function () {
          (0, _expect.default)(parse('1 2')).to.eql({
            'date-parts': [[2, 1]]
          });
          (0, _expect.default)(parse('1 -2')).to.eql({
            'date-parts': [[-2, 1]]
          });
        });
      });
      describe('with year-precision', function () {
        it('works', function () {
          (0, _expect.default)(parse('2000')).to.eql({
            'date-parts': [[2000]]
          });
          (0, _expect.default)(parse('-2000')).to.eql({
            'date-parts': [[-2000]]
          });
        });
      });
    });
    describe('invalid time', function () {
      it('works for non-strings and non-numbers', function () {
        (0, _expect.default)(parse()).to.eql({
          raw: undefined
        });
      });
      it('works for invalid month names', function () {
        var inputs = ['2000 naj 1', '1 naj 2000', 'naj 2000', '2000 naj'];

        for (var _i2 = 0; _i2 < inputs.length; _i2++) {
          var _input = inputs[_i2];
          (0, _expect.default)(parse(_input)).to.have.property('raw', _input);
        }
      });
      it('works for invalid strings', function () {
        (0, _expect.default)(parse('foo')).to.have.property('raw', 'foo');
      });
      it('works for invalid numbers', function () {
        (0, _expect.default)(parse(NaN)).to.have.property('raw');
        (0, _expect.default)(parse(Infinity)).to.eql({
          raw: Infinity
        });
      });
    });
  });
  describe('interface', function () {
    var _Cite$parse = _citation.default.parse,
        chain = _Cite$parse.chain,
        chainAsync = _Cite$parse.chainAsync,
        chainLink = _Cite$parse.chainLink,
        chainLinkAsync = _Cite$parse.chainLinkAsync;
    describe('chain', function () {
      it('parses', function () {
        (0, _expect.default)(chain({}, {
          generateGraph: false
        })).to.eql([{}]);
      });
      it('parses until success', function () {
        (0, _expect.default)(chain('{}', {
          generateGraph: false
        })).to.eql([{}]);
      });
      it('copies', function () {
        var object = {};
        (0, _expect.default)(chain(object)[0]).not.to.be(object);
      });
      describe('options', function () {
        it('generateGraph', function () {
          (0, _expect.default)(chain({}, {
            generateGraph: true
          })[0]).to.have.property('_graph');
          (0, _expect.default)(chain({}, {
            generateGraph: false
          })[0]).not.to.have.property('_graph');
        });
        it('maxChainLength', function () {
          (0, _expect.default)(chain({}, {
            maxChainLength: 1,
            generateGraph: false
          })).to.eql([{}]);
          (0, _expect.default)(chain({}, {
            maxChainLength: 0,
            generateGraph: false
          })).to.eql([]);
        });
        it('forceType', function () {
          (0, _expect.default)(chain({}, {
            generateGraph: false
          })).to.eql([{}]);
          (0, _expect.default)(chain({}, {
            forceType: '@foo/bar',
            generateGraph: false
          })).to.eql([]);
        });
      });
    });
    describe('chainLink', function () {
      it('parses', function () {
        (0, _expect.default)(chainLink({})).to.eql([{}]);
      });
      it('parses only once', function () {
        (0, _expect.default)(chainLink('{}')).to.eql({});
      });
      it('copies', function () {
        var object = {};
        (0, _expect.default)(chainLink(object)[0]).not.to.be(object);
      });
    });
    describe('chainAsync', function () {
      it('parses', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = _expect.default;
                _context.next = 3;
                return chainAsync({}, {
                  generateGraph: false
                });

              case 3:
                _context.t1 = _context.sent;
                _context.t2 = [{}];
                (0, _context.t0)(_context.t1).to.eql(_context.t2);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })));
      it('parses until success', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = _expect.default;
                _context2.next = 3;
                return chainAsync('{}', {
                  generateGraph: false
                });

              case 3:
                _context2.t1 = _context2.sent;
                _context2.t2 = [{}];
                (0, _context2.t0)(_context2.t1).to.eql(_context2.t2);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
      it('copies', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var object;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                object = {};
                _context3.t0 = _expect.default;
                _context3.next = 4;
                return chainAsync(object);

              case 4:
                _context3.t1 = _context3.sent[0];
                _context3.t2 = object;
                (0, _context3.t0)(_context3.t1).not.to.be(_context3.t2);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      })));
      describe('options', function () {
        it('generateGraph', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.t0 = _expect.default;
                  _context4.next = 3;
                  return chainAsync({}, {
                    generateGraph: true
                  });

                case 3:
                  _context4.t1 = _context4.sent[0];
                  (0, _context4.t0)(_context4.t1).to.have.property('_graph');
                  _context4.t2 = _expect.default;
                  _context4.next = 8;
                  return chainAsync({}, {
                    generateGraph: false
                  });

                case 8:
                  _context4.t3 = _context4.sent[0];
                  (0, _context4.t2)(_context4.t3).not.to.have.property('_graph');

                case 10:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        })));
        it('maxChainLength', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.t0 = _expect.default;
                  _context5.next = 3;
                  return chainAsync({}, {
                    maxChainLength: 1,
                    generateGraph: false
                  });

                case 3:
                  _context5.t1 = _context5.sent;
                  _context5.t2 = [{}];
                  (0, _context5.t0)(_context5.t1).to.eql(_context5.t2);
                  _context5.t3 = _expect.default;
                  _context5.next = 9;
                  return chainAsync({}, {
                    maxChainLength: 0,
                    generateGraph: false
                  });

                case 9:
                  _context5.t4 = _context5.sent;
                  _context5.t5 = [];
                  (0, _context5.t3)(_context5.t4).to.eql(_context5.t5);

                case 12:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        })));
        it('forceType', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.t0 = _expect.default;
                  _context6.next = 3;
                  return chainAsync({}, {
                    generateGraph: false
                  });

                case 3:
                  _context6.t1 = _context6.sent;
                  _context6.t2 = [{}];
                  (0, _context6.t0)(_context6.t1).to.eql(_context6.t2);
                  _context6.t3 = _expect.default;
                  _context6.next = 9;
                  return chainAsync({}, {
                    forceType: '@foo/bar',
                    generateGraph: false
                  });

                case 9:
                  _context6.t4 = _context6.sent;
                  _context6.t5 = [];
                  (0, _context6.t3)(_context6.t4).to.eql(_context6.t5);

                case 12:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        })));
      });
    });
    describe('chainLinkAsync', function () {
      it('parses', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.t0 = _expect.default;
                _context7.next = 3;
                return chainLinkAsync({});

              case 3:
                _context7.t1 = _context7.sent;
                _context7.t2 = [{}];
                (0, _context7.t0)(_context7.t1).to.eql(_context7.t2);

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      })));
      it('parses only once', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.t0 = _expect.default;
                _context8.next = 3;
                return chainLinkAsync('{}');

              case 3:
                _context8.t1 = _context8.sent;
                _context8.t2 = {};
                (0, _context8.t0)(_context8.t1).to.eql(_context8.t2);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      })));
      it('copies', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var object;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                object = {};
                _context9.t0 = _expect.default;
                _context9.next = 4;
                return chainLinkAsync(object);

              case 4:
                _context9.t1 = _context9.sent[0];
                _context9.t2 = object;
                (0, _context9.t0)(_context9.t1).not.to.be(_context9.t2);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      })));
    });
  });
});

},{"./Q21972834.json":5,"./Q27795847.json":6,"./citation":8,"./input/parse":13,"./output/parse":16,"expect.js":3}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
    "unicode": "@Book{Fau86,\n  author    = \"J.W. Goethe\",\n  title     = \"Faust. Der Trag\\\"{o}die Erster Teil\",\n  publisher = \"Reclam\",\n  year      = 1986,\n  address   = \"Stuttgart\"\n}",
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
      "type": "article",
      "title": "On a family of symmetric Bernoulli convolutions",
      "author": [
        {
          "name": "Erdös, Paul"
        }
      ],
      "journal": {
        "name": "American Journal of Mathematics",
        "identifier": [
          {
            "id": "0002-9327",
            "type": "issn"
          }
        ],
        "volume": "61",
        "pages": "974--976"
      },
      "year": "1939",
      "owner": "me",
      "id": "ID_1",
      "collection": "my_collection",
      "url": "http://example.com/me/my_collection/ID_1",
      "link":[
        {
          "url": "http://okfn.org",
          "anchor": "Open Knowledge Foundation"
        }
      ]
    },
    "quickscrape": {
      "title": "Gitksan medicinal plants-cultural choice and efficacy",
      "link": [
        {
          "type": "fulltext_html",
          "url": "https://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29"
        },
        {
          "type": "fulltext_pdf",
          "url": "https://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29"
        }
      ],
      "author": [
        {
          "name": "Leslie Main Johnson",
          "institution": "Centre for Work and Community Studies and Centre for Integrated Studies, Athabasca University, Athabasca, Canada"
        },
        {
          "institution": "Anthropology Department, University of Alberta, Edmonton, Canada"
        }
      ],
      "publisher": { "name": "BioMed Central" },
      "journal": {
        "volume": "2",
        "issue": "1",
        "firstpage": "29",
        "name": "Journal of Ethnobiology and Ethnomedicine",
        "issn": "1746-4269"
      },
      "sections": {
        "abstract": {
          "text": "The use of plants for healing by any cultural group is integrally related to local concepts of the nature of disease, the nature of plants, and the world view of the culture. The physical and chemical properties of the plants themselves also bear on their selection by people for medicines, as does the array of plants available for people to choose from. I examine use of medicinal plants from a "
        },
        "description": {
          "text": "The use of plants for healing by any cultural group is integrally related to local concepts of the nature of disease, the nature of plants, and the world view of the culture. The physical and chemical properties of the plants themselves also bear on their selection by people for medicines, as does the array of plants available for people to choose from. I examine use of medicinal plants from a "
        }
      },
      "date": { "published": "2006-06-21T00:00:00+02:00" },
      "identifier": [ { "type": "doi", "id": "10.1186/1746-4269-2-29" } ],
      "license": [ { "raw": "This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited." } ],
      "copyright": [ "2006 Johnson; licensee BioMed Central Ltd." ],
      "log": [ { "date": "2018-07-12T18:35:20+02:00", "event": "scraped by quickscrape v0.4.7" } ]
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

},{}],14:[function(require,module,exports){
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
  describe('CSL bibliography', function () {
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
        testCaseGenerator(data, opts('string', 'string', 'citation-apa', 'custom'), '(Custom).')();
      });
    });
  });
  describe('CSL citation', function () {
    var data = new _citation.default([{
      id: '1',
      type: 'article-journal',
      title: 'a',
      issued: {
        'date-parts': [[2011]]
      }
    }, {
      id: '2',
      type: 'article-journal',
      title: 'b',
      author: [{
        family: 'd',
        given: 'c'
      }, {
        literal: 'h'
      }],
      issued: {
        'date-parts': [[2012]]
      }
    }, {
      id: '3',
      type: 'article-journal',
      title: 'e',
      author: [{
        family: 'f',
        given: 'g'
      }],
      issued: {
        'date-parts': [[2013]]
      }
    }]);
    it('works', function () {
      var input = data.format('citation', {
        entry: ['1', '2']
      });
      var output = '(“a,” 2011; d & h, 2012)';
      (0, _expect.default)(input).to.be(output);
    });
    it('works for single entries', function () {
      var input = data.format('citation', {
        entry: '2'
      });
      var output = '(d & h, 2012)';
      (0, _expect.default)(input).to.be(output);
    });
    it('defaults to all entries', function () {
      var input = data.format('citation');
      var output = '(“a,” 2011; d & h, 2012; f, 2013)';
      (0, _expect.default)(input).to.be(output);
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

},{"./citation":8,"./input/get":12,"./output/get":15,"expect.js":3}],15:[function(require,module,exports){
module.exports={
  "csl": {
    "apa": "Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society, 79(20), 5441–5444. https://doi.org/10.1021/ja01577a030",
    "vancouver": "1. Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 1957 Jan 1;79(20):5441–4.",
    "title": "Correlation of the Base Strengths of Amines 1",
    "html": {
      "apa": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">Hall, H. K. (1957). Correlation of the Base Strengths of Amines 1. <i>Journal of the American Chemical Society</i>, <i>79</i>(20), 5441–5444. https://doi.org/10.1021/ja01577a030</div>\n</div>",
      "vancouver": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">\n    <div class=\"csl-left-margin\">1. </div><div class=\"csl-right-inline\">Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 1957 Jan 1;79(20):5441–4.</div>\n   </div>\n</div>",
      "title": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"Q23571040\" class=\"csl-entry\">Correlation of the Base Strengths of Amines 1</div>\n</div>",
      "locale": "<div class=\"csl-bib-body\">\n  <div data-csl-entry-id=\"a\" class=\"csl-entry\"> (Custom).</div>\n</div>",
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

},{}],16:[function(require,module,exports){
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
    "unicode": {
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
        "type": "article",
        "title": "On a family of symmetric Bernoulli convolutions",
        "author": [
          {"given": "Paul", "family": "Erdös"}
        ],
        "container-title": "American Journal of Mathematics",
        "ISSN": "0002-9327",
        "volume": 61,
        "page": "974-976",
        "issued": {"date-parts": [[1939]]},
        "URL": "http://okfn.org"
      }
    ],
    "quickscrape": [
      {
        "type": "article-journal",
        "title": "Gitksan medicinal plants-cultural choice and efficacy",
        "author": [
          {"given": "Leslie Main", "family": "Johnson"}
        ],
        "publisher": "BioMed Central",
        "container-title": "Journal of Ethnobiology and Ethnomedicine",
        "volume": 2,
        "issue": 1,
        "page-first": "29",
        "issued": {
          "date-parts": [[
            2006,
            6,
            21
          ]]
        },
        "id": "10.1186/1746-4269-2-29",
        "DOI": "10.1186/1746-4269-2-29",
        "ISSN": "1746-4269",
        "URL": "https://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29"
      }
    ]
  }
}

},{}],17:[function(require,module,exports){
"use strict";

var _expect = _interopRequireDefault(require("expect.js"));

var _citation = _interopRequireDefault(require("./citation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

describe('plugins', function () {
  var ref = '@test';
  var type = "".concat(ref, "/foo");
  var subType = "".concat(ref, "/bar");
  var data = [{
    foo: 1
  }];

  var parse = function parse() {
    return data;
  };

  var parseAsync = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", data);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function parseAsync() {
      return _ref.apply(this, arguments);
    };
  }();

  afterEach(function () {
    _citation.default.plugins.remove(ref);
  });
  it('registers', function () {
    _citation.default.plugins.add(ref);

    (0, _expect.default)(_citation.default.plugins.has(ref)).to.be.ok();
  });
  it('works', function () {
    _citation.default.plugins.add(ref, {
      input: _defineProperty({}, type, {
        parseType: {
          predicate: /foo/
        }
      })
    });

    (0, _expect.default)(_citation.default.parse.has(type)).to.ok();
    (0, _expect.default)(_citation.default.parse.type('foo')).to.be(type);
  });
  it('removes', function () {
    _citation.default.plugins.add(ref, {
      input: _defineProperty({}, type, {
        parseType: {
          predicate: /foo/
        }
      })
    });

    _citation.default.plugins.remove(ref);

    (0, _expect.default)(_citation.default.parse.has(type)).to.not.be.ok();
    (0, _expect.default)(_citation.default.parse.hasTypeParser(type)).to.not.be.ok();
    (0, _expect.default)(_citation.default.parse.hasDataParser(type)).to.not.be.ok();
    (0, _expect.default)(_citation.default.parse.hasDataParser(type, true)).to.not.be.ok();
    (0, _expect.default)(_citation.default.parse.type('foo')).to.not.be(type);
  });
  describe('input', function () {
    describe('typeParser', function () {
      afterEach(function () {
        _citation.default.parse.remove(type);
      });
      it('registers', function () {
        _citation.default.parse.add(type, {
          parseType: {}
        });

        (0, _expect.default)(_citation.default.parse.hasTypeParser(type)).to.be.ok();
      });
      it('works', function () {
        _citation.default.parse.add(type, {
          parseType: {
            predicate: /foo/
          }
        });

        (0, _expect.default)(_citation.default.parse.type('foo')).to.be(type);
      });
      it('removes', function () {
        _citation.default.parse.add(type, {
          parseType: {}
        });

        _citation.default.parse.remove(type);

        (0, _expect.default)(_citation.default.parse.hasTypeParser(type)).to.not.be.ok();
        (0, _expect.default)(_citation.default.parse.type('foo')).to.not.be(type);
      });
      it('removes non-existing', function () {
        (0, _expect.default)(_citation.default.parse.remove).withArgs(type).not.to.throwException();
      });
      context('subtypes', function () {
        afterEach(function () {
          _citation.default.parse.remove(type);

          _citation.default.parse.remove(subType);
        });
        it('registers', function () {
          _citation.default.parse.add(type, {
            parseType: {}
          });

          _citation.default.parse.add(subType, {
            parseType: {
              extends: type
            }
          });

          (0, _expect.default)(_citation.default.parse.hasTypeParser(type)).to.be.ok();
          (0, _expect.default)(_citation.default.parse.hasTypeParser(subType)).to.be.ok();
        });
        it('waits on parent type', function () {
          _citation.default.parse.add(subType, {
            parseType: {
              extends: type,
              predicate: /foo/
            }
          });

          _citation.default.parse.add(type, {
            parseType: {
              predicate: /fo/
            }
          });

          (0, _expect.default)(_citation.default.parse.hasTypeParser(type)).to.be.ok();
          (0, _expect.default)(_citation.default.parse.hasTypeParser(subType)).to.be.ok();
          (0, _expect.default)(_citation.default.parse.type('foo')).to.be(subType);
        });
        it('works', function () {
          _citation.default.parse.add(type, {
            parseType: {
              predicate: /fo/
            }
          });

          _citation.default.parse.add(subType, {
            parseType: {
              extends: type,
              predicate: /foo/
            }
          });

          (0, _expect.default)(_citation.default.parse.type('foo')).to.be(subType);
        });
        it('delegates to parent type', function () {
          _citation.default.parse.add(type, {
            parseType: {
              predicate: /fo/
            }
          });

          _citation.default.parse.add(subType, {
            parseType: {
              extends: type,
              predicate: /foobar/
            }
          });

          (0, _expect.default)(_citation.default.parse.type('foo')).to.be(type);
        });
        it('removes', function () {
          _citation.default.parse.add(type, {
            parseType: {
              predicate: /fo/
            }
          });

          _citation.default.parse.add(subType, {
            parseType: {
              extends: type,
              predicate: /foo/
            }
          });

          _citation.default.parse.remove(subType);

          (0, _expect.default)(_citation.default.parse.hasTypeParser(subType)).to.not.be.ok();
          (0, _expect.default)(_citation.default.parse.type('foo')).to.not.be(subType);
        });
      });
      describe('class', function () {
        var TypeParser = _citation.default.parse.util.TypeParser;
        it('can be combined', function () {
          var _ref2 = new TypeParser({
            predicate: function predicate(object) {
              return Object.keys(object).length === 2;
            },
            propertyConstraint: {
              props: 'foo'
            }
          }),
              predicate = _ref2.predicate;

          (0, _expect.default)(predicate({
            foo: 1,
            bar: 2
          })).to.be.ok();
          (0, _expect.default)(predicate({
            bar: 1,
            baz: 2
          })).not.to.be.ok();
          (0, _expect.default)(predicate({
            foo: 1
          })).not.to.be.ok();
          (0, _expect.default)(predicate({})).not.to.be.ok();
        });
        it('validates', function () {
          var instance;
          instance = new TypeParser({});
          (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
          instance = new TypeParser(1);
          (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
            (0, _expect.default)(e).to.be.a(TypeError);
            (0, _expect.default)(e).to.match(/typeParser was number; expected object/);
          });
        });
        describe('dataType', function () {
          it('outputs properly', function () {
            var instance = new TypeParser({
              dataType: 'SimpleObject'
            });
            (0, _expect.default)(instance.dataType).to.be('SimpleObject');
          });
          it('can be inferred', function () {
            (0, _expect.default)(new TypeParser({
              predicate: /foo/
            }).dataType).to.be('String');
            (0, _expect.default)(new TypeParser({
              elementConstraint: '@foo/bar'
            }).dataType).to.be('Array');
            (0, _expect.default)(new TypeParser({}).dataType).to.be('Primitive');
            (0, _expect.default)(new TypeParser({
              dataType: 'Array',
              predicate: /foo/
            }).dataType).to.be('Array');
          });
          it('validates', function () {
            var instance = new TypeParser({
              dataType: 'String'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('invalidates non-datatypes', function () {
            var instance = new TypeParser({
              dataType: 'Blue'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(RangeError);
              (0, _expect.default)(e).to.match(/dataType was Blue; expected one of/);
            });
          });
          it('invalidates non-strings', function () {
            var instance = new TypeParser({
              dataType: 12
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(RangeError);
              (0, _expect.default)(e).to.match(/dataType was 12; expected one of/);
            });
          });
          describe('values', function () {
            it('String', function () {
              (0, _expect.default)(_citation.default.parse.util.dataTypeOf('foo')).to.be('String');
            });
            it('Array', function () {
              (0, _expect.default)(_citation.default.parse.util.dataTypeOf([])).to.be('Array');
            });
            it('SimpleObject', function () {
              (0, _expect.default)(_citation.default.parse.util.dataTypeOf({})).to.be('SimpleObject');
            });
            it('ComplexObject', function () {
              (0, _expect.default)(_citation.default.parse.util.dataTypeOf(/foo/)).to.be('ComplexObject');
            });
            it('Primitive', function () {
              (0, _expect.default)(_citation.default.parse.util.dataTypeOf(null)).to.be('Primitive');
            });
            describe('typeOf', function () {
              it('Undefined', function () {
                (0, _expect.default)(_citation.default.parse.util.typeOf(undefined)).to.be('Undefined');
              });
              it('Null', function () {
                (0, _expect.default)(_citation.default.parse.util.typeOf(null)).to.be('Null');
              });
              it('primitive literal', function () {
                (0, _expect.default)(_citation.default.parse.util.typeOf('')).to.be('String');
              });
              it('Object', function () {
                (0, _expect.default)(_citation.default.parse.util.typeOf({})).to.be('Object');
              });
            });
          });
        });
        describe('predicate', function () {
          it('outputs properly for functions', function () {
            var _ref3 = new TypeParser({
              predicate: function predicate(a) {
                return a === 'foo';
              }
            }),
                predicate = _ref3.predicate;

            (0, _expect.default)(predicate('foo')).to.be.ok();
            (0, _expect.default)(predicate('bar')).not.to.be.ok();
          });
          it('outputs properly for regex', function () {
            var _ref4 = new TypeParser({
              predicate: /^foo$/
            }),
                predicate = _ref4.predicate;

            (0, _expect.default)(predicate('foo')).to.be.ok();
            (0, _expect.default)(predicate('bar')).not.to.be.ok();
          });
          it('validates functions', function () {
            var instance = new TypeParser({
              predicate: function predicate() {}
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('validates regex', function () {
            var instance = new TypeParser({
              predicate: /a/
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('invalidates non-predicates', function () {
            var instance = new TypeParser({
              predicate: 'Blue'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(TypeError);
              (0, _expect.default)(e).to.match(/predicate was string; expected RegExp or function/);
            });
          });
        });
        describe('tokenList', function () {
          it('outputs properly for objects', function () {
            var _ref5 = new TypeParser({
              tokenList: {
                token: /a/
              }
            }),
                predicate = _ref5.predicate;

            (0, _expect.default)(predicate('a a a')).to.be.ok();
            (0, _expect.default)(predicate(' a a a ')).to.be.ok();
            (0, _expect.default)(predicate('a b a')).not.to.be.ok();
          });
          it('outputs properly for regex', function () {
            var _ref6 = new TypeParser({
              tokenList: /a/
            }),
                predicate = _ref6.predicate;

            (0, _expect.default)(predicate('a a a')).to.be.ok();
            (0, _expect.default)(predicate('a b a')).not.to.be.ok();
          });
          it('outputs properly for object with split', function () {
            var _ref7 = new TypeParser({
              tokenList: {
                token: /^a$/,
                split: /b/
              }
            }),
                predicate = _ref7.predicate;

            (0, _expect.default)(predicate('ababa')).to.be.ok();
            (0, _expect.default)(predicate('a a a')).not.to.be.ok();
            (0, _expect.default)(predicate('abcba')).not.to.be.ok();
          });
          it('outputs properly for object without trim', function () {
            var _ref8 = new TypeParser({
              tokenList: {
                token: /^a$/,
                trim: false
              }
            }),
                predicate = _ref8.predicate;

            (0, _expect.default)(predicate('a a a')).to.be.ok();
            (0, _expect.default)(predicate(' a a a ')).not.to.be.ok();
          });
          it('outputs properly for object without every', function () {
            var _ref9 = new TypeParser({
              tokenList: {
                token: /^a$/,
                every: false
              }
            }),
                predicate = _ref9.predicate;

            (0, _expect.default)(predicate('a b a b a')).to.be.ok();
            (0, _expect.default)(predicate('b b')).not.to.be.ok();
          });
          it('validates objects', function () {
            var instance = new TypeParser({
              tokenList: {}
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('validates regex', function () {
            var instance = new TypeParser({
              tokenList: /a/
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('invalidates non-tokenlists', function () {
            var instance = new TypeParser({
              tokenList: 'Blue'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(TypeError);
              (0, _expect.default)(e).to.match(/tokenList was string; expected object or RegExp/);
            });
          });
        });
        describe('propertyConstraint', function () {
          it('outputs properly for one prop', function () {
            var _ref10 = new TypeParser({
              propertyConstraint: {
                props: 'foo'
              }
            }),
                predicate = _ref10.predicate;

            (0, _expect.default)(predicate({
              foo: 1,
              bar: 2
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1
            })).to.be.ok();
            (0, _expect.default)(predicate({})).not.to.be.ok();
            (0, _expect.default)(predicate({
              bar: 2
            })).not.to.be.ok();
          });
          it('outputs properly for prop predicates', function () {
            var _ref11 = new TypeParser({
              propertyConstraint: {
                props: ['foo'],
                value: function value(_value) {
                  return _value === 1;
                }
              }
            }),
                predicate = _ref11.predicate;

            (0, _expect.default)(predicate({
              foo: 1
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 2
            })).not.to.be.ok();
            (0, _expect.default)(predicate({})).not.to.be.ok();
            (0, _expect.default)(predicate({
              bar: 1
            })).not.to.be.ok();
          });
          it('outputs properly for match=every', function () {
            var _ref12 = new TypeParser({
              propertyConstraint: {
                props: ['foo', 'bar'],
                match: 'every'
              }
            }),
                predicate = _ref12.predicate;

            (0, _expect.default)(predicate({
              foo: 1,
              bar: 2
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1,
              bar: 2,
              baz: 3
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1
            })).not.to.be.ok();
            (0, _expect.default)(predicate({})).not.to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1,
              baz: 3
            })).not.to.be.ok();
            (0, _expect.default)(predicate({
              baz: 3
            })).not.to.be.ok();
          });
          it('outputs properly for match=some', function () {
            var _ref13 = new TypeParser({
              propertyConstraint: {
                props: ['foo', 'bar'],
                match: 'some'
              }
            }),
                predicate = _ref13.predicate;

            (0, _expect.default)(predicate({
              foo: 1,
              bar: 2
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1,
              bar: 2,
              baz: 3
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1
            })).to.be.ok();
            (0, _expect.default)(predicate({
              foo: 1,
              baz: 3
            })).to.be.ok();
            (0, _expect.default)(predicate({})).not.to.be.ok();
            (0, _expect.default)(predicate({
              baz: 3
            })).not.to.be.ok();
          });
          it('validates objects', function () {
            var instance = new TypeParser({
              propertyConstraint: {}
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('validates arrays', function () {
            var instance = new TypeParser({
              propertyConstraint: []
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('invalidates non-objects', function () {
            var instance = new TypeParser({
              propertyConstraint: 'Blue'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(TypeError);
              (0, _expect.default)(e).to.match(/propertyConstraint was string; expected array or object/);
            });
          });
        });
        describe('elementConstraint', function () {
          it('outputs properly', function () {
            _citation.default.parse.add('@foo/bar', {
              parseType: {
                predicate: /foo/
              }
            });

            var _ref14 = new TypeParser({
              elementConstraint: '@foo/bar'
            }),
                predicate = _ref14.predicate;

            (0, _expect.default)(predicate([])).to.be.ok();
            (0, _expect.default)(predicate(['foo'])).to.be.ok();
            (0, _expect.default)(predicate(['foo', 'foo'])).to.be.ok();
            (0, _expect.default)(predicate(['bar'])).not.to.be.ok();
            (0, _expect.default)(predicate(['foo', 'bar'])).not.to.be.ok();
            (0, _expect.default)(predicate(['bar', 'bar'])).not.to.be.ok();
          });
          it('validates', function () {
            var instance = new TypeParser({
              elementConstraint: '@foo/bar'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('invalidates non-strings', function () {
            var instance = new TypeParser({
              elementConstraint: 12
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(TypeError);
              (0, _expect.default)(e).to.match(/elementConstraint was number; expected string/);
            });
          });
        });
        describe('extends', function () {
          it('outputs properly', function () {
            var _ref15 = new TypeParser({
              extends: '@foo/bar'
            }),
                extend = _ref15.extends;

            (0, _expect.default)(extend).to.be('@foo/bar');
          });
          it('validates', function () {
            var instance = new TypeParser({
              extends: '@foo/bar'
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.not.throwException();
          });
          it('invalidates non-strings', function () {
            var instance = new TypeParser({
              extends: 2
            });
            (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
              (0, _expect.default)(e).to.be.a(TypeError);
              (0, _expect.default)(e).to.match(/extends was number; expected string/);
            });
          });
        });
      });
    });
    describe('dataParser', function () {
      afterEach(function () {
        _citation.default.parse.remove(type);
      });
      it('registers', function () {
        _citation.default.parse.add(type, {
          parse: parse
        });

        (0, _expect.default)(_citation.default.parse.hasDataParser(type)).to.be.ok();
      });
      it('works', function () {
        _citation.default.parse.add(type, {
          parse: parse
        });

        (0, _expect.default)(_citation.default.parse.data('foo', type)).to.eql(data);
      });
      it('removes', function () {
        _citation.default.parse.add(type, {
          parse: parse
        });

        _citation.default.parse.remove(type);

        (0, _expect.default)(_citation.default.parse.hasDataParser(type)).to.not.be.ok();
        (0, _expect.default)(_citation.default.parse.data('foo', type)).to.not.be(type);
      });
      describe('async', function () {
        afterEach(function () {
          _citation.default.parse.remove(type);
        });
        it('registers', function () {
          _citation.default.parse.add(type, {
            parseAsync: parseAsync
          });

          (0, _expect.default)(_citation.default.parse.hasDataParser(type, true)).to.be.ok();
        });
        it('works', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _citation.default.parse.add(type, {
                    parseAsync: parseAsync
                  });

                  _context2.t0 = _expect.default;
                  _context2.next = 4;
                  return _citation.default.parse.dataAsync('foo', type);

                case 4:
                  _context2.t1 = _context2.sent;
                  _context2.t2 = data;
                  (0, _context2.t0)(_context2.t1).to.eql(_context2.t2);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        })));
        it('removes', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _citation.default.parse.add(type, {
                    parseAsync: parseAsync
                  });

                  _citation.default.parse.remove(type);

                  (0, _expect.default)(_citation.default.parse.hasDataParser(type, true)).to.not.be.ok();
                  _context3.t0 = _expect.default;
                  _context3.next = 6;
                  return _citation.default.parse.dataAsync('foo', type);

                case 6:
                  _context3.t1 = _context3.sent;
                  _context3.t2 = type;
                  (0, _context3.t0)(_context3.t1).to.not.be(_context3.t2);

                case 9:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        })));
      });
      describe('class', function () {
        var DataParser = _citation.default.parse.util.DataParser;
        it('works', function () {
          var instance = new DataParser(function () {});
          var async = new DataParser(function () {}, {
            async: true
          });
          (0, _expect.default)(_typeof(instance.parser)).to.be('function');
          (0, _expect.default)(_typeof(async.parser)).to.be('function');
          (0, _expect.default)(instance.async).not.to.be.ok();
          (0, _expect.default)(async.async).to.be.ok();
        });
        it('validates', function () {
          var instance = new DataParser(function () {});
          (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        });
        it('invalidates non-functions', function () {
          var instance = new DataParser(12);
          (0, _expect.default)(instance.validate.bind(instance)).to.throwException(function (e) {
            (0, _expect.default)(e).to.be.a(TypeError);
            (0, _expect.default)(e).to.match(/parser was number; expected function/);
          });
        });
      });
    });
    describe('class', function () {
      var FormatParser = _citation.default.parse.util.FormatParser;
      it('validates format', function () {
        var instance;
        instance = new FormatParser('@foo/bar');
        (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        instance = new FormatParser('@foo');
        (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        instance = new FormatParser('@foo/baz+bar');
        (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        instance = new FormatParser('foo');
        (0, _expect.default)(instance.validate.bind(instance)).to.throwException();
        instance = new FormatParser('foo/bar');
        (0, _expect.default)(instance.validate.bind(instance)).to.throwException();
        instance = new FormatParser('foo/baz+bar');
        (0, _expect.default)(instance.validate.bind(instance)).to.throwException();
      });
      it('validates parsers', function () {
        var instance;
        instance = new FormatParser('@foo/bar', {
          parseType: {
            dataType: 'String'
          }
        });
        (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        instance = new FormatParser('@foo/bar', {
          parseType: {
            dataType: 12
          }
        });
        (0, _expect.default)(instance.validate.bind(instance)).to.throwException();
        instance = new FormatParser('@foo/bar', {
          parseAsync: function parseAsync() {}
        });
        (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        instance = new FormatParser('@foo/bar', {
          parse: 12
        });
        (0, _expect.default)(instance.validate.bind(instance)).to.throwException();
        instance = new FormatParser('@foo/bar', {
          parseAsync: function parseAsync() {}
        });
        (0, _expect.default)(instance.validate.bind(instance)).not.to.throwException();
        instance = new FormatParser('@foo/bar', {
          parseAsync: 12
        });
        (0, _expect.default)(instance.validate.bind(instance)).to.throwException();
      });
    });
  });
});

},{"./citation":8,"expect.js":3}]},{},[7,9,10,14,17]);
