import { css } from 'glamor';
import variables from 'Styles/variables';

export const container = css({
  fontWeight: 500,
  margin: 0,
});

export const noReviews = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: variables.gap.small,
  padding: `0 ${variables.gap.small}px`,
  textAlign: 'center',
});
