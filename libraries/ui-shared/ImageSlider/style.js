import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const slider = css({
  maxHeight: '100%',
  position: 'relative',
  width: 'auto',
}).toString();

const indicator = {
  bullets: css({
    position: 'absolute',
    bottom: 2,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  }).toString(),
  fraction: css({
    background: 'rgba(255, 255, 255, .5)',
    borderRadius: '1em',
    fontSize: 14,
    lineHeight: 1,
    padding: '.5em 10px',
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  }).toString(),
};

const dot = {
  display: 'inline-block',
  margin: 5,
  borderRadius: '50%',
  width: themeConfig.variables.gap.small,
  height: themeConfig.variables.gap.small,
};

const inactiveIndicator = css({
  ...dot,
  backgroundColor: themeConfig.colors.shade5,
}).toString();

const activeIndicator = css({
  ...dot,
  backgroundColor: themeConfig.colors.shade6,
}).toString();

const container = css({}).toString();

const slide = css({}).toString();

export default {
  slider,
  indicator,
  inactiveIndicator,
  activeIndicator,
  container,
  slide,
};
