import { css } from 'glamor';

export const link = css({
  color: 'var(--color-link, inherit)',
  ':visited': {
    color: 'var(--color-link-visited, var(--color-link, inherit))',
  },
  ':hover': {
    color: 'var(--color-link-active , var(--color-link, inherit))',
  },
}).toString();
