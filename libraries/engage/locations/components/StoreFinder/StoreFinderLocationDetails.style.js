import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

export const accordionHeader = css({
  borderTop: `1px solid ${themeColors.shade7}`,
  cursor: 'pointer',
  ' svg': {
    display: 'inline',
  },
}).toString();

export const accordionContent = css({
  fontSize: '0.875rem',
  ' > div': {
    padding: 0,
  },
}).toString();
