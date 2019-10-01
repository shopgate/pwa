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

const editableContainer = css({
  position: 'relative',
});

const editableField = css({
  position: 'absolute',
  top: 0,
  left: 0,
  textAlign: 'center',
  background: 'transparent',
  zIndex: 2,
  textIndent: -800,
  outline: 'none',
  padding: 0,
  margin: 0,
  border: '1px solid transparent',
  borderRadius: 3,
  lineHeight: 1,
  ':focus': {
    background: colors.light,
    textIndent: 0,
    borderColor: colors.shade5,
  },
});

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
  editableContainer,
  editableField,
};
