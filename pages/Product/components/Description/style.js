import { css } from 'glamor';
import colors from 'Styles/colors';

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
  overflow: 'hidden',
  wordBreak: ['break-all', 'break-word'],
  hyphens: 'auto',
  ' ul': {
    listStyle: 'disc',
  },
  ' ol': {
    listStyle: 'decimal',
  },
  ' ul, ol': {
    margin: '.75em 0',
    paddingLeft: '1.2em',
  },
  ' a': {
    color: colors.primary,
    margin: '-.35em',
    padding: '.35em',
    position: 'relative',
  },
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
