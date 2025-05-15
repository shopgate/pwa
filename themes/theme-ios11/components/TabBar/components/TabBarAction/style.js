import { css } from 'glamor';

const container = css({
  display: 'flex',
  position: 'relative',
  flexBasis: 0,
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'center',
  fontWeight: 500,
  fontSize: '0.64rem',
  height: '100%',
  '> svg': {
    flexGrow: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
    minHeight: 32,
  },
}).toString();

const regular = css({
  color: 'var(--tab-bar-item-default-color)',
}).toString();

const highlighted = css({
  color: 'var(--tab-bar-item-highlighted-color)',
}).toString();

const label = css({
  ':not(:empty)': {
    display: 'block',
  },
}).toString();

const item = css({
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'space-between',
  height: '100%',
  marginTop: 5,
}).toString();

export default {
  container,
  item,
  regular,
  highlighted,
  label,
};
