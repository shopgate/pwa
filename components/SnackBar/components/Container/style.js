import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.background,
  padding: `${variables.gap.small}px ${variables.gap.bigger}px`,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

export default {
  container,
};
