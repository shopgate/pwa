import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const button = cxs({
  outline: 0,
  marginLeft: 10,
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  justifyContent: 'center',
  height: variables.filterbar.height,
  whiteSpace: 'nowrap',
});

const buttonActive = cxs({
  color: colors.light,
});

const selection = cxs({
  fontSize: '0.875rem',
  fontWeight: '500',
  lineHeight: 1,
  paddingTop: 1,
  alignSelf: 'center',
});

const icon = cxs({
  fontSize: '1.5rem',
});

const dropdown = cxs({
  position: 'absolute',
  width: '100%',
  zIndex: 2,
  top: variables.filterbar.height,
  left: 0,
  backgroundColor: colors.background,
  boxShadow: 'rgba(0, 0, 0, 0.16) 0 4px 4px',
});

const selectItem = cxs({
  padding: 0,
  outline: 0,
  overflow: 'hidden',
  textAlign: 'left',
  width: '100%',
  ':last-child': {
    marginBottom: variables.gap.big,
  },
});

const selectRipple = cxs({
  padding: '6px 5px 6px 18px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

const selectBox = cxs({
  flexGrow: 2,
});

export default {
  button,
  buttonActive,
  selection,
  icon,
  dropdown,
  selectItem,
  selectRipple,
  selectBox,
};
