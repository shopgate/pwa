import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { shadows, colors, variables } = themeConfig;

const wrapper = css({
  padding: `${variables.gap.big * 0.75}px ${variables.gap.big}px`,
}).toString();

const price = css({
  color: colors.accent,
  display: 'inline-block',
  fontWeight: 500,
  textAlign: 'center',
}).toString();

const rangeSlider = {
  container: css({
    paddingTop: variables.gap.big,
    paddingBottom: variables.gap.big,
  }).toString(),

  outerRange: css({
    background: colors.darkGray,
    height: 8,
    position: 'relative',
  }).toString(),

  range: css({
    background: colors.accent,
    position: 'absolute',
    height: '100%',
    marginLeft: variables.gap.small,
    marginRight: variables.gap.small,
  }).toString(),

  handleInner: css({
    background: colors.light,
    boxShadow: shadows.filter.priceSlider,
    borderRadius: '50%',
    width: variables.gap.big * 1.5,
    height: variables.gap.big * 1.5,
  }).toString(),

  handleOuter: css({
  }).toString(),
};

export default {
  wrapper,
  price,
  rangeSlider,
};
