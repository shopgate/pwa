import { css } from 'glamor';

const container = css({
  fontSize: 14,
  marginTop: 8,
  padding: '13px 16px 16px',
  userSelect: 'all',
}).toString();

const title = css({
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 8,
}).toString();

const content = css({
  lineHeight: 1.7,
}).toString();

const placeholder = css({
  height: 14,
}).toString();

export default {
  container,
  title,
  content,
  placeholder,
};
