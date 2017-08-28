import cxs from 'cxs';
import { colors } from 'Templates/styles';

const baseIcon = {
  width: 24,
  height: 24,
};

const checkedIcon = cxs({
  ...baseIcon,
  color: colors.accent,
});

const uncheckedIcon = cxs({
  ...baseIcon,
  color: colors.shade6,
});

export default {
  checkedIcon,
  uncheckedIcon,
};
