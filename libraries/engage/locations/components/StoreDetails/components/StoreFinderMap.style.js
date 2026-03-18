import { css } from 'glamor';

export const container = css({
  height: '100%',
  width: '100%',
});

export const markerSelected = css({
  ' svg': {
    height: 40,
    width: 40,
    fontSize: '1.5rem',
    color: 'var(--color-primary)',
  },
}).toString();
