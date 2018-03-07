# CountdownTimer
---

The CountdownTimer component renders a dynamic countdown for a given timestamp.

## Getting Started

```
import { CountdownTimer } from 'Templates/components';

<CountdownTimer timeout={myTimestamp} />
```

## Props

### className

_Default_: `''`  
_Type_: `string`

Additional classes that are to be appended to the CountdownTimer container.

###### Usage:

```
<CountdownTimer className="class1 class2" ... />
```

### timeout (required)

_Type_: `number`<br>

The timeout for this countdown timer. The value must be an absolute timestamp represented in seconds. 

###### Usage:

```
const myTimestamp = Math.floor(Date.now() / 1000) + 30

<CountdownTimer timeout={myTimestamp} />
```

The example above will cause the timer to expire in about 30 seconds from now.

### onExpire

_Type_: `function`<br>

An optional callback triggered when the countdown is expired.
The function will only be called when the countdown is not already expired before it was rendered.

###### Usage:

```
<CountdownTimer timeout={myTimestamp} onExpire={ () => console.log('Countdown expired!') } />
```
---
