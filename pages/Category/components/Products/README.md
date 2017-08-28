# Products
---

This component handles the product list and product grid.
Depending on the view mode the list or grid is hidden and not rendered.

## Getting Started

```
import { Products } from 'Templates/components';
import { GRID_VIEW } from 'Library/constants/ViewModes';

<Products viewMode={GRID_VIEW} />
```

All props are passed to the ProductList and ProductGrid. See their documentations for their props.

## Props

### viewMode (required)

_Type_: `oneOf[GRID_VIEW, LIST_VIEW]`

The view mode that decides how the product list is being rendered.

###### Usage:

```
import { Products } from 'Templates/components';
import { GRID_VIEW } from 'Library/constants/ViewModes';

<Products viewMode={GRID_VIEW} />
```

---
