import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const { gap } = variables;

const content = css({
  backgroundColor: colors.shade8,
  fontSize: 14,
  padding: `0 ${(gap.small * 1.375)}px ${gap.big}px`,
  marginBottom: (gap.big * 1.5),
}).toString();

const label = css({
  paddingBottom: (gap.small * 1.5),
}).toString();

const cell = css({
  maxWidth: 100,
  padding: '2px 5px',
  overflowWrap: 'break-word',
}).toString();

const table = css({
  paddingTop: 2,
}).toString();

export default {
  content,
  label,
  cell,
  table,
};
