# RangeSlider
---
The range slider component is a form element that allows the selection of a single value or a value range inside a defined
minimum and maximum passed to the **min** and **max** attributes.

## Getting Started

### Single value selection
```markup
import { RangeSlider } from 'Library/components';

<RangeSlider min={10} max={200} value={30} />
```

### Range selection
```markup
import { RangeSlider } from 'Library/components';

<RangeSlider min={10} max={200} value={[30,10]} />
```

## Properties

### value
_Default_: `[0,100]`<br>
_Type_: `number|Array`<br>

The value attribute defines the initial value or a pair of values if
a range should be collected.

###### Usage:

In case of a single value the range slider will only collect and pass one value
to the event callback:

```
<RangeSlider value={30} onChange={(value) => ...} />
```

In case of a value pair passed as an array the event callback will be invoked
with the minimum and maximum value of the selected range:

```
<RangeSlider value={[10,30]} onChange={(minValue, maxValue) => ...} />
```

### max
_Default_: `100`<br>
_Type_: `number`<br>

Specifies the minimum value that can be selected. If **min** and **max** are not specified the range defaults are set to an interval between _0_ and _100_.

###### Usage:

```
<RangeSlider max={30} />
```

### min
_Default_: `0`<br>
_Type_: `number`<br>

Specifies the minimum value that can be selected. If **min** and **max** are not specified the range defaults are set to an interval between _0_ and _100_.

###### Usage:

```
<RangeSlider min={10} />
```

### step
_Default_: `1`<br>
_Type_: `number`<br>

The **step** attribute sets the minimum distance between distinct values on the
slider that can be selected.

###### Usage:
```
<RangeSlider step={15}/>
```

The example above would only allow the selection of the values _0_, _15_, _30_, _45_, _..._

### onChange
_Type_: `Function`<br>

An optional callback invoked when the selection of the slider has changed.
If a single value is passed to the **value** attribute, the slider does not collect
a range and will pass only one value to the callback.

###### Usage:

To collect single values:
```
<RangeSlider value={30} onChange={(value) => ...} />
```

To collect a value range:
```
<RangeSlider value={[10,30]} onChange={(minValue, maxValue) => ...} />
```

## Notes

The interaction with the handles is only working for touch events. Testing this component in a desktop browser requires using the browsers mobile simulation features in order to recognize touch events.

Touching a handle component will modify its **z-index** style property in order to keep the current handle selectable in case of overlapping. It strongly recommended not to modify the **z-index** of a **RangeSliderHandle** manually.

---
