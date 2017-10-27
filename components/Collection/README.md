# Collection
---

This component is an abstract component intended for any collection of uniform components that should
be rendered (e.g. ordered/unordered lists).


## Getting Started

```
import Collection from 'Components/Collection';

<Collection elementIndexProp="myIndex" firstElementProp="amIFirst" lastElementProp="amILast">
  <MyComponent label="my first component"/>
  <MyComponent label="my second component"/>
  ...
</Collection>
```

The example shown above would render a collection of `MyComponent` elements. It is assumed that `MyComponent`
accepts the properties `myIndex`, `amIFirst` and `amILast` to gain information about their respective position
in the collection.

## Props

### className

_Type_: `string`<br>
_Defaults_: `''`<br>

Styling for the container element.

###### Usage:

```
import { Link } from 'Library/components';
import style from './my-awesome.style';

<Collection className={style}>
  <span>foo</span>
</Collection>
```

### container

_Type_: `string`<br>
_Defaults_: `'div'`<br>

The tag of the element containing the collection elements.

###### Usage:

```
<Collection container="ul">
  <li>I'm a list element!</li>
  <li>Another list element.</li>
</Collection>
```

The expected DOM result of the code shown above would be:

```
<ul>
  <li>I'm a list element!</li>
  <li>Another list element.</li>
</ul>
```

### elementIndexProp

_Type_: `string`<br>
_Defaults_: `null`<br>

The name of the child property that should receive the current index of the element.

###### Usage:

```
import { Link } from 'Library/components';

const MyComponent = props => (
  <span>MyComponent #{props.myIndex}</span>
);

<Collection elementIndexProp="myIndex">
  <MyComponent />
  <MyComponent />
  <MyComponent />
  <MyComponent />
</Collection>
```

The code above would result in the following DOM:

```
<div>
  <span>MyComponent #0</span>
  <span>MyComponent #1</span>
  <span>MyComponent #2</span>
  <span>MyComponent #3</span>
</div>
```

### firstElementProp

_Type_: `string`<br>
_Defaults_: `null`<br>

The name of the child property that should receive information about if this is the first element in
the collection.

###### Usage:

```
import { Link } from 'Library/components';

const MyComponent = props => (
  <span>{props.amIFirst ? `I'm the first element.` : `I'm not the first one.`}</span>
);

<Collection firstElementProp="amIFirst">
  <MyComponent />
  <MyComponent />
  <MyComponent />
  <MyComponent />
</Collection>
```

The code above would result in the following DOM:

```
<div>
  <span>I'm the first element.</span>
  <span>I'm not the first one.</span>
  <span>I'm not the first one.</span>
  <span>I'm not the first one.</span>
</div>
```

### lastElementProp

_Type_: `string`<br>
_Defaults_: `null`<br>

The name of the child property that should receive information about if this is the first element in
the collection.

###### Usage:

```
import { Link } from 'Library/components';

const MyComponent = props => (
  <span>{props.amILast ? "I'm the last element." : "I'm not the last one."}</span>
);

<Collection lastElementProp="amILast">
  <MyComponent />
  <MyComponent />
  <MyComponent />
  <MyComponent />
</Collection>
```

The code above would result in the following DOM:

```
<div>
  <span>I'm not the last one.</span>
  <span>I'm not the last one.</span>
  <span>I'm not the last one.</span>
  <span>I'm the last element!</span>
</div>
```
---
