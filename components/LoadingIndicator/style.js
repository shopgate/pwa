import cxs from 'cxs';
import { colors } from '../../config/app';

const loadingIndicator = cxs({
  display: 'block',
  padding: '1em',
  textAlign: 'center',
  fontSize: '1.5em',
  color: colors.accent,
});

export default loadingIndicator;
