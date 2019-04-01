import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const button = css({
  color: 'inherit',
  outline: 0,
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  padding: 0,
  justifyContent: 'center',
  height: 44,
  whiteSpace: 'nowrap',
}).toString();

const selection = css({
  fontSize: '0.8823rem',
  lineHeight: 1,
  alignSelf: 'center',
}).toString();

const icon = css({
  fontSize: '1.5rem',
}).toString();

const iconOpen = css({
  transform: 'rotate(180deg)',
}).toString();

const dropdown = css({
  background: '#fff',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0 2px 2px',
  left: 0,
  position: 'absolute',
  top: '100%',
  width: '100%',
  zIndex: 2,
}).toString();

const selectItem = css({
  padding: 0,
  outline: 0,
  overflow: 'hidden',
  textAlign: 'left',
  width: '100%',
  ':first-child': {
    marginTop: variables.gap.big / 2,
  },
  ':last-child': {
    marginBottom: variables.gap.big / 2,
  },
}).toString();

const selectBox = css({
  flexGrow: 2,
}).toString();

export default {
  button,
  selection,
  icon,
  iconOpen,
  dropdown,
  selectItem,
  selectBox,
};
