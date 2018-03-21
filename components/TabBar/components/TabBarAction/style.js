import { css } from 'glamor';
import colors from 'Styles/colors';

const regularColor = '#a1a1a1';

const container = css({
  display: 'flex',
  position: 'relative',
  flexBasis: 0,
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'center',
  fontWeight: 500,
  fontSize: '0.64rem',
  height: '100%',
  padding: 0,
  '> svg': {
    flexGrow: 1,
    marginTop: 2,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
}).toString();

const regular = css({
  color: regularColor,
}).toString();

const highlighted = css({
  color: colors.accent,
}).toString();

const label = css({
  marginBottom: 2,
}).toString();

export default {
  container,
  regular,
  highlighted,
  label,
};
