import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const button = css({
  color: 'inherit',
  outline: 0,
  marginLeft: 10,
  padding: '0 10px',
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  justifyContent: 'center',
  height: variables.filterbar.height,
  whiteSpace: 'nowrap',
}).toString();

const selection = css({
  fontSize: 17,
  lineHeight: 1,
  paddingTop: 1,
  alignSelf: 'center',
}).toString();

const icon = css({
  fontSize: '1.5rem',
  marginRight: 2,
}).toString();

const dropdown = css({
  position: 'absolute',
  width: '100%',
  zIndex: 2,
  top: variables.filterbar.height,
  left: 0,
  backgroundColor: colors.light,
  ':after': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 0.5,
    background: colors.dividers,
  },
}).toString();

const selectItem = css({
  padding: 0,
  outline: 0,
  overflow: 'hidden',
  margin: '0 20px',
  textAlign: 'left',
  width: 'calc(100% - 40px)',
  ':not(:last-child)': {
    borderBottom: `solid 0.5px ${colors.dividers}`,
  },
}).toString();

const selectBox = css({
  flexGrow: 2,
}).toString();

export default {
  button,
  selection,
  icon,
  dropdown,
  selectItem,
  selectBox,
};
