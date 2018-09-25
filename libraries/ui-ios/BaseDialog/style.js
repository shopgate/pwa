import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const outerGap = 40;
const border = 'rgba(181, 181, 181, 0.7)';

const container = css({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  width: 270,
  maxHeight: `calc(100vh - ${outerGap * 2}px)`,
  borderRadius: 13,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
}).toString();

const content = css({
  padding: themeConfig.variables.gap.small * 3,
  paddingBottom: themeConfig.variables.gap.small * 2,
}).toString();

const title = css({
  fontSize: '1.125rem',
  textAlign: 'center',
  lineHeight: themeConfig.font.lineHeight,
  fontWeight: 500,
  paddingBottom: themeConfig.variables.gap.small,
  marginTop: '-.25em',
}).toString();

const body = css({
  color: '#000',
  flexGrow: 1,
  fontSize: '0.875rem',
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
    fontSize: '1.06rem',
    fontWeight: 'normal',
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
    fontWeight: 500,
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
