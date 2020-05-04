import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const toggle = css({
  display: 'flex',
  flexFlow: 'row no-wrap',
  alignContent: 'stretch',
  alignItems: 'flex-start',
});

export const label = css({
  whiteSpace: 'no-wrap',
  flexShrink: 0,
  flexGrow: 1,
  textAlign: 'left',
  maxWidth: '50%',
  minWidth: '35%',
  paddingRight: '16px',
});

export const selected = css({
  display: 'flex',
  flexFlow: 'row wrap',
  flexGrow: 1,
  justifyContent: 'flex-end',
  minWidth: '50%',
  maxWidth: '65%',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    marginRight: 16,
  },
});

export const closed = css({
  fontWeight: 'normal',
});

export const open = css({
  fontWeight: 'bold',
});
