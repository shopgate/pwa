import { css } from 'glamor';
import variables from 'Styles/variables';

const { gap } = variables;

const content = css({
  fontSize: '0.875rem',
  padding: `0 ${(gap.small * 1.375)}px ${gap.big}px`,
  marginBottom: 12,
});

const label = css({
  paddingBottom: (gap.small * 1.5),
});

const table = css({
  paddingTop: 2,
});

export default {
  content,
  label,
  table,
};
