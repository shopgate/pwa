import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core';

export default css(useScrollContainer() ? {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
} : {});
