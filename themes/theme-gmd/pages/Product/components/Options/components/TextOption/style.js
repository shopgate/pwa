import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const row = css({
  marginBottom: variables.gap.small,
}).toString();

const wrapper = css({
  backgroundColor: colors.shade8,
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  minHeight: 60,
}).toString();

const element = css({
  paddingBottom: 0,
  '& label': {
    fontWeight: 400,
    color: 'inherit',
  },
  '& input': {
    fontWeight: 500,
  },
}).toString();

const infoIcon = css({
  color: colors.shade9,
}).toString();

export default {
  row,
  wrapper,
  element,
  infoIcon,
};
