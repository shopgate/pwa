import cxs from 'cxs';
import { colors, variables } from 'Templates/styles';

const item = cxs({
  fontSize: '0.875rem',
  padding: `${variables.gap.small / 2}px ${variables.gap.big}px`,
});

const grid = cxs({
  flexDirection: 'column',
});

const icon = cxs({
  fontSize: '3rem',
  flexShrink: 0,
  margin: '5px 12px 0 12px',
});

const content = cxs({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: variables.gap.big,
  paddingTop: variables.gap.small,
  paddingBottom: variables.gap.small,
});

const contentLast = cxs({
  alignItems: 'flex-end',
});

const title = cxs({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.125,
  marginBottom: 4,
});

const savedPrice = cxs({
  fontSize: '1rem',
  fontWeight: 500,
  color: colors.primary,
});

const closeIcon = cxs({
  padding: 0,
  fontSize: 24,
  marginTop: -2,
  marginRight: -5,
});

export default {
  item,
  grid,
  savedPrice,
  icon,
  content,
  contentLast,
  title,
  closeIcon,
};
