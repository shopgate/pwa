import React from 'react';
import BaseProductCharacteristics from '@shopgate/pwa-common/components/ProductCharacteristics';
import withProductContext from '../../connectors/withProductContext';

export default withProductContext(({ productContext, ...otherProps }) => (
  <BaseProductCharacteristics {...productContext} {...otherProps} />
));
