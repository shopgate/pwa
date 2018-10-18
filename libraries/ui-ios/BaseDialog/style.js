import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const outerGap = 40;
const border = 'rgb(63,63,63)';

const container = css({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  width: 270,
  maxHeight: `calc(100vh - ${outerGap * 2}px)`,
  borderRadius: 14,
  background: 'rgba(255, 255, 255, 0.82)',
  backdropFilter: 'blur(20px)',
}).toString();

const content = css({
  padding: '16px',
}).toString();

const title = css({
  textAlign: 'center',
  fontWeight: 600,
}).toString();

const body = css({
  color: '#000',
  flexGrow: 1,
  fontSize: '.765rem',
  textAlign: 'center',
  overflow: 'auto',
}).toString();

const actions = css({
  borderTop: `0.5px solid ${border}`,
  display: 'flex',
  flexWrap: 'wrap',
}).toString();

const button = css({
  // Increases specifity to allow button customization.
  '&&': {
    fontWeight: 600,
    minWidth: '50%',
    flexGrow: 1,
  },
  /*
   * Due to overflow hidden this will cause the bottom border to be
   * not visible in vertical button mode.
   */
  marginBottom: -1,
  marginRight: `-${themeConfig.variables.gap.small / 2}px`,
  '&:not(:last-child)': {
    borderRadius: 0,
    borderRight: `0.5px solid ${border}`,
    borderBottom: `0.5px solid ${border}`,
  },
}).toString();

const buttonPrimary = css({
  '&&': {
    fontWeight: 600,
  },
}).toString();

const buttonText = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
}).toString();

export default {
  container,
  content,
  title,
  body,
  actions,
  button,
  buttonPrimary,
  buttonText,
};
