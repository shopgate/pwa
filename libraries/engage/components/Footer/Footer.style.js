import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core/helpers';

export const footer = css({
  bottom: 0,
  flexShrink: 1,
  position: 'relative',
  zIndex: 1,
  ...(!useScrollContainer() ? {
    position: 'sticky',
  } : {}),
});
