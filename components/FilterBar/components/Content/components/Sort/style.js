import { css } from 'glamor';
import { themeShadows, themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

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
  background: themeColors.light,
  boxShadow: themeShadows.filter.sort,
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
  color: themeColors.dark,
  ':first-child': {
    marginTop: themeVariables.gap.big / 2,
  },
  ':last-child': {
    marginBottom: themeVariables.gap.big / 2,
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
