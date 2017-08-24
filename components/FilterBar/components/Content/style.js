import cxs from 'cxs';
import variables from 'Styles/variables';

const filterBar = cxs({
  alignItems: 'center',
  transition: 'box-shadow 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
});

const filterButton = cxs({
  display: 'flex',
});

const filterButtonLabel = cxs({
  alignSelf: 'center',
  fontSize: '0.875rem',
  fontWeight: '500',
  lineHeight: 1,
  paddingTop: 1,
  paddingRight: variables.gap.small,
});

const filterButtonRipple = cxs({
  // ...ripple,
  margin: '0 6px',
  padding: '6px 10px',
});

const selectBox = cxs({
  width: 'auto',
  padding: 12,
});

const cardList = cxs({
  width: '100%',
  paddingLeft: 12,
  paddingRight: 12,
});

export default {
  filterButton,
  filterButtonLabel,
  filterButtonRipple,
  filterBar,
  selectBox,
  cardList,
};
