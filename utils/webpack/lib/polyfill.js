window.SGEvent = {}

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength, padString) {
    // Floor if number or convert non-number to 0
    targetLength = targetLength >> 0
    padString = String(padString || ' ')
    if (this.length > targetLength) {
      return String(this)
    } else {
      targetLength = targetLength - this.length

      if (targetLength > padString.length) {
        // Append to original to ensure we are longer than needed.
        padString += padString.repeat(targetLength / padString.length)
      }

      return String(this) + padString.slice(0, targetLength)
    }
  }
}

if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth) {
    var flattened = [];

    function flatten(arr, currentDepth) {
      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i]) && currentDepth < depth) {
          flatten(arr[i], currentDepth + 1);
        } else {
          flattened.push(arr[i]);
        }
      }
    }

    flatten(this, 0);

    return flattened;
  };
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return this.map(callback, thisArg).flat();
  };
}
