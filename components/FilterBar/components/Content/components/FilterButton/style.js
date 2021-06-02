import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const button = css({
  color: 'inherit',
  fontSize: '1.4rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: 44,
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
});

const filterButton = css({
  display: 'flex',
}).toString();

const filterButtonLabel = css({
  alignSelf: 'center',
  fontSize: '0.875rem',
  fontWeight: '500',
  lineHeight: 1,
  paddingTop: 1,
  paddingRight: '.5ch',
}).toString();

const filterButtonRipple = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: '0 0 0 16px',
}).toString();

export default {
  button,
  filterButton,
  filterButtonLabel,
  filterButtonRipple,
};
