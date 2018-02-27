# AddToCartButton
---

The add to cart button component renders a rounded button that will put the current product in to the cart. When clicked a bounce animation is triggered that will bounce in the checkmark icon and bounce out the cart icon and vice versa.

## Getting Started

```jsx
import AddToCartButton from 'Components/AddToCartButton';

<AddToCartButton handleAddToCart={() => {}} isLoading isOrderable={false} />
```

## Props

### handleAddToCart (required)

_Type_: `function`  

This function will be called when the user clicks the button and `isOrderable` is `true` and `isLoading` is `false`

###### Usage:

```jsx
<AddToCartButton handleAddToCart={() => { console.log('addToCart'); }} isLoading={false} isOrderable />
```

### isLoading (required)

_Type_: `boolean`  

Should be `true` to indicate that the product or related data is currently loading.
If `true` the button will contain a spinning loading icon.

###### Usage:

```jsx
<AddToCartButton handleAddToCart={() => { console.log('addToCart'); }} isLoading isOrderable={false} />
```

### isOrderable (required)

_Type_: `boolean`  

Should be `true` to indicate that the current product is orderable, if not orderable the button won't trigger the checkmark animation when clicked.
`handleAddToCart` will be still called though to handle missing variant selection..

###### Usage:

```jsx
<AddToCartButton handleAddToCart={() => { console.log('addToCart'); }} isLoading isOrderable />
```
---

### buttonSize

_Type_: `number`  
_default_: 40

Defines the size of the button.

### iconSize

_Type_: `number`  
_default_: 20

Defines the size of the inner icon.
