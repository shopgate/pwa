# Shopgate Eslint Configuration

Shopgate's reasonable approach to JavaScript.

This configuration is an extension of the airbnb codestyle which is [available here](https://github.com/airbnb/javascript).

## Installation

```
npm i eslint-config-shopgate --save-dev
```

## Usage

Add the following to the `.eslintrc` in your project:

```
{
  "extends": "shopgate",
  ...
}
```

## Rules

1. [General](#general)  
  1.1. [Commented out code](#commented-out-code)  
  1.2. [Comma dangle](#comma-dangle)  
  1.3. [Multiple empty lines](#multiple-empty-lines)
2. [Comments](#comments)  
  2.1. [Capitalized comments](#capitalized-comments)
3. [Functions](#functions)  
  3.1. [Point free](#point-free)
4. [Objects](#objects)  
  4.1. [Single line objects](#single-line-objects)
5. [Documentation](#documentation)  
  5.1. [JSDoc requirement](#jsdoc-required)
6. [React](#react)  
  6.1 [Prop Types](#react-proptypes)

### General

<a id="commented-out-code"></a><a name="1.1"></a>
#### Commented out code
No code should be left commented out.

```javascript
/**
 * static propTypes = {
 *    width: PropTypes.string.isRequired,
 *    color: PropTypes.string,
 *    height: PropTypes.string.isRequired,
 * };
 */
```

**[⬆ back to top](#rules)**

<a id="comma-dangle"></a><a name="1.2"></a>
#### Comma dangle
Dangling commas are required for objects with multiple items or properties. This applies to `Array`, `Object`, `Import` and `Export`.

```javascript
// bad
const myObject = {
  a: 1,
  b: 2
};

// good
const myObject = {
  a: 1,
  b: 2,
};

// bad
import { var1, var2, var3 } from 'Variables';

// good
import {
  var1,
  var2,
  var3,
} from 'Variables';
```

**[⬆ back to top](#rules)**

<a id="multiple-empty-lines"></a><a name="1.3"></a>
#### Multiple empty lines
There should not be multiple empty lines between code blocks.

```javascript
// bad
const a = 1;
const b = 1;


while (...) {
  ...
}

// good
const a = 1;
const b = 2;

while (...) {
  ...
}
```

**[⬆ back to top](#rules)**

### Comments

<a id="capitalized-comments"></a><a name="2.1"></a>
#### Capitalized comments
All comments should beging with a capital letter. This makes comments more readable and forces more care when constructing comments.

```javascript
// bad
/**
 * toString() needs to be called here because...
 */

// good
/**
 * This string now needs to be lowercase so that...
 */
```

**[⬆ back to top](#rules)**

### Functions

<a id="point-free"></a><a name="3.1"></a>
#### Point free
A function should not simply call another function.

```javascript
const funcA = (params) {
  ...
};

const funcB = (params) {
  funcA(params);
};
```

**[⬆ back to top](#rules)**

### Objects

<a id="single-line-objects"></a><a name="4.1"></a>
#### Single line objects 
If an object is defined with multiple properties then each property should occupy a new line.

```javascript
// bad
const x = { a: 1, b: 2, c: 3 };

// good
const w = { a: 1 };
const x = {
  a: 1,
  b: 2,
  c: 3,
};
```

**[⬆ back to top](#rules)**

### Documentation

<a id="jsdoc-required"></a><a name="3.1"></a>
#### JSDoc requirement
Every `Function`, `Class`, `Method` and `Arrow Function` definition should include a valid JSDoc specification.

```javascript
// bad (missing parameter descriptions)
/**
 * This is funcA. It does something complicated.
 */
const funcA = (param1, param2) {
  ...
};

// bad (invalid specification)
/**
 * This is funcB. It also does something complicated.
 * @param {Object} parameters
 */
const funcB = (param1, param2) {
  ...
};

// good
/**
 * It does something simple because we are using our heads.
 * @param {string} param1 - My first parameter.
 * @param {boolean} param2 - My Second parameter.
 */
const funcC = (param1, param2) {
  ...
};
```

**[⬆ back to top](#rules)**

### React

<a id="react-proptypes"></a><a name="6.1"></a>
#### Prop Types
Proptypes should be sorted by type (required or not) and alphabetically.

```javascript
// bad
static propTypes = {
  width: PropTypes.string.isRequired,
  color: PropTypes.string,
  height: PropTypes.string.isRequired,
};

// good
static propTypes = {
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  color: PropTypes.string,
};
```

**[⬆ back to top](#rules)**