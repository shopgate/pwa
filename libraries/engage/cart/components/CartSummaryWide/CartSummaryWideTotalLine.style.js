import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const container = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: `${variables.gap.small}px 0`,
  '&:last-child': {
    paddingBottom: 0,
  },
}).toString();

export const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();
