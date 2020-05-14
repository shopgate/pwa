import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const wrapper = css({
  display: 'block',
  color: 'var(--color-text-low-emphasis)',
  fontSize: 12,
  padding: `${variables.gap.big}px 0`,
  '> *:first-child': {
    margin: 0,
  },
  ' ol, ul': {
    margin: `${variables.gap.small}px 0`,
    paddingLeft: variables.gap.xbig,
  },
  ' ol': {
    listStyle: 'decimal',
  },
  ' ul': {
    listStyle: 'disc',
  },
  ' a': {
    textDecoration: 'underline',
    color: 'var(--color-primary)',
  },
}).toString();
