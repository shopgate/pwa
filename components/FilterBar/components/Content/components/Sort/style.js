import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { shadows, colors, variables } = themeConfig;

const button = css({
  color: 'inherit',
  outline: 0,
  marginLeft: 10,
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  justifyContent: 'center',
  height: variables.filterbar.height,
  whiteSpace: 'nowrap',
}).toString();

const selection = css({
  fontSize: '0.875rem',
  fontWeight: '500',
  lineHeight: 1,
  paddingTop: 1,
  alignSelf: 'center',
}).toString();

const icon = css({
  fontSize: '1.5rem',
}).toString();

const iconOpen = css({
  transform: 'rotate(180deg)',
}).toString();

const dropdown = css({
  position: 'absolute',
  width: '100%',
  zIndex: 2,
  top: '100%',
  left: 0,
  background: colors.background,
  boxShadow: shadows.filter.sort,
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
