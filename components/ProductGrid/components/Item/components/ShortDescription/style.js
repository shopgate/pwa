import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const wrapper = css({
  display: 'none',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'block',
    color: 'var(--color-text-medium-emphasis)',
  },
});
