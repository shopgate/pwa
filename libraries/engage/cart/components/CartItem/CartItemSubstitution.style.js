import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const root = css({
  padding: gap.big,
  borderTop: `1px solid ${themeColors.shade7}`,
}).toString();
