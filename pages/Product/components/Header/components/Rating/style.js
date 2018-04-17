import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  display: 'flex',
  alignItems: 'center',
  lineHeight: '12px',
  marginBottom: variables.gap.small,
}).toString();

export { container };
