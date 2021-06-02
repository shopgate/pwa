import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const button = css({
  color: 'inherit',
  fontSize: '1.5rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: variables.filterbar.height,
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
  paddingRight: variables.gap.small,
}).toString();

const filterButtonRipple = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 6px',
  padding: '6px 10px',
}).toString();

export default {
  button,
  filterButton,
  filterButtonLabel,
  filterButtonRipple,
};
