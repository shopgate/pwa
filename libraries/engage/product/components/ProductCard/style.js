import { css } from 'glamor';

const details = css({
  padding: '12px 16px',
  lineHeight: 1.35,
}).toString();

const title = css({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
}).toString();

const badgeWrapper = css({
  minWidth: 40,
}).toString();

export default {
  badgeWrapper,
  details,
  title,
};
