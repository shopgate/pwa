import cxs from 'cxs';
import { variables } from 'Templates/styles';

const headline = cxs({
  fontSize: 18,
  margin: `${variables.gap.big * 2}px 0 ${variables.gap.big}px`,
  textAlign: 'center',
});

export default {
  headline,
};
