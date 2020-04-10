import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const container = css({
  fontSize: '0.875rem',
  padding: '0.8125rem 1rem 1rem',
});

export const title = css({
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: '0.5rem',
});

export const content = css({
  lineHeight: 1.7,
  overflow: 'hidden',
  wordBreak: ['break-all', 'break-word'],
  hyphens: 'auto',
  ' ul': {
    listStyle: 'disc',
  },
  ' ol': {
    listStyle: 'decimal',
  },
  ' ul, ol': {
    margin: '.75em 0',
    paddingLeft: '1.2em',
  },
  ' a': {
    color: `var(--color-primary, ${colors.primary})`,
    margin: '-.35em',
    padding: '.35em',
    position: 'relative',
  },
});

export const placeholder = css({
  height: '0.875rem',
}).toString();
