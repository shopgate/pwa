import cxs from 'cxs';
import { colors, variables } from 'Templates/styles';

const leftColumnWidth = 72;
const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

const item = cxs({
  padding: variables.gap.big,
});

const leftColumn = cxs({
  width: leftColumnWidth,
});

const content = cxs({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: variables.gap.big,
});

const image = cxs({
  background: colors.placeholder,
  marginBottom: variables.gap.small * 1.25,
  height: leftColumnWidth,
  width: leftColumnWidth,
});

const title = cxs({
  fontWeight: 500,
  lineHeight: 1.125,
});

const info = cxs({
  fontSize: '0.875rem',
  marginTop: variables.gap.big * 0.875,
  marginBottom: variables.gap.small * 0.25,
  flexGrow: 1,
  alignItems: 'flex-end',
  justifyContent: 'space-between',
});

const stock = cxs({
  marginTop: variables.gap.small * 0.25,
});

const price = cxs({
  fontSize: '1rem',
  fontWeight: 500,
  textAlign: 'right',
});

const priceStriked = cxs({
  fontSize: '.875rem',
  textAlign: 'right',
});

const menuContainer = cxs({
  marginRight: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
});

const menuToggle = cxs({
  height: menuToggleSize,
  width: menuToggleSize,
  marginTop: `-${variables.gap.small}px`,
  fontSize: menuToggleFontSize,
  padding: variables.gap.small * 0.5,
});

export default {
  item,
  leftColumn,
  content,
  image,
  price,
  priceStriked,
  title,
  info,
  stock,
  menuContainer,
  menuToggle,
};
