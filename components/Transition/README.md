# Transition
---
The transition component is a **Higher Order Component** that animates its first child to the given **from** and/or **to** attributes.
It uses the GreenSock Animation Platform ([GSAP](https://greensock.com/docs/#/HTML5/GSAP/)) to run the animations.
It allows you to animate any CSS attribute that can be transformed from one state to another.

> **Note:** This component will only animate the first child it has. For this reason, using multiple children should be avoided.

## Getting Started

```markup
import { Transition } from 'Library/components';

<Transition from={{ x: '100%' }} to={{ x: '0%' }}>
  <MyChildComponent />
</Transition>
```

## Props

### from, to (required)

_Type_: `Object`<br>
_Values_: See [TweenMax.fromTo()](https://greensock.com/docs/#/HTML5/GSAP/TweenMax/fromTo/)

These are objects that represent the start and end state of the animating object.

They can be used together or standalone.

###### Usage:

```
<Transition from={{ x: '100%' }} to={{ x: '0%' }}>
  <MySuperComponent />
</Transition>
```

### set

Sets the animation state of an object to an absolute value.

This can be necessary when animating in conjunction with 'auto' values.

###### Usage:

```
<Transition set={{ height: 'auto' }} from={{ height: 0 }}>
  <MySuperComponent />
</Transition>
```

### easing

_Default_: `Power1.easeOut`<br>
_Type_: `string`<br>
_Values_: See [GSAP-Easing](https://greensock.com/docs/#/HTML5/GSAP/Easing/)

The name of the easing function to use while animating.

###### Usage:

```
<Transition easing="Bounce.easeIn">
  <MySuperComponent />
</Transition>
```

### origin

_Default_: `0 0 0`<br>
_Type_: `string`<br>
_Values_: See [transform-origin docs](https://developer.mozilla.org/en/docs/Web/CSS/transform-origin)

A value representing the basis point for the animation. This maps directly to the `transform-origin` property that CSS provides.

###### Usage:

```
<Transition origin="50%, 50%, 0">
  <MySuperComponent />
</Transition>
```
---
