import { css } from 'glamor';
import colors from '../../styles/colors';

const list = css({
  margin: '0 20px 8px',
});

const loggedInListItem = css({
  '&:first-child': {
    boxShadow: `0 -4px 0 0 ${colors.darkGray}`,
  },
  boxShadow: `0 -1px 0 0 ${colors.darkGray}`,
  padding: '12px 0',
  'button&': {
    outline: 0,
    textAlign: 'inherit',
    width: '100%',
  },
});

const headline = {
  margin: '24px 20px 16px',
};

export default {
  list,
  loggedInListItem,
  headline,
};
