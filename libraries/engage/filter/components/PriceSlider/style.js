import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '../../../styles';

const { shadows, colors, variables } = themeConfig;

const wrapper = css({
  padding: `${variables.gap.big * 0.75}px ${variables.gap.big}px`,
}).toString();

const price = css({
  color: `var(--color-primary, ${colors.secondary})`,
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
  [responsiveMediaQuery('>=xs', { webOnly: true })]: {
    borderColor: 'var(--color-primary)',
    padding: '4px 0',
    top: -4,
    ':focus': {
      borderColor: 'var(--color-primary)',
    },
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
    background: `var(--color-primary, ${colors.secondary})`,
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

const srOnly = css({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export default {
  wrapper,
  price,
  rangeSlider,
  editableContainer,
  editableField,
  srOnly,
};
