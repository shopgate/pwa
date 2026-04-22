import React from 'react';
import { ProductCharacteristics as BaseProductCharacteristics } from '@shopgate/engage/product/components';
import withProductContext from '../../connectors/withProductContext';

export default withProductContext(({ productContext, ...otherProps }) => (
  <BaseProductCharacteristics {...productContext} {...otherProps} />
));
