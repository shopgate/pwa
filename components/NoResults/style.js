import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = cxs({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  textAlign: 'center',
  background: colors.shade8,
});

const icon = cxs({
  width: 216,
  color: colors.primary,
});

const headline = cxs({
  fontSize: '1.25rem',
  fontWeight: 500,
  marginTop: 40,
});

const text = cxs({
  marginTop: variables.gap.big,
  padding: `0 ${variables.gap.big}px`,
});

export default {
  wrapper,
  icon,
  headline,
  text,
};
