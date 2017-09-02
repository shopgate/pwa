# PriceDifference
---
Shows a difference of price. Renders the text in red if the price difference is negative,
renders it green if price is positive.

## Getting Started
```
import { PriceDifference } from 'Template/components';

<PriceDifference currency="EUR" priceDifference={-1.5} />
```

## Props

### priceDifference (required)
_Type_: `number`

The difference of the price.

###### Usage:
```
import { PriceDifference } from 'Template/components';

<PriceDifference currency="EUR" priceDifference={-1.5} />
```


### currency (required)
_Type_: `string`

The currency in what the price difference should be displayed.

###### Usage:
```
import { PriceDifference } from 'Template/components';

<PriceDifference currency="EUR" priceDifference={-1.5} />
```
