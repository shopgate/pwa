import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  background: colors.light,
  textAlign: 'center',
  height: '100%',
}).toString();

const container = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: '1',
  flexShrink: '0',
}).toString();

const icon = css({
  width: 216,
}).toString();

const title = css({
  textAlign: 'center',
  paddingTop: variables.gap.big * 2.25,
}).toString();

const buttonContainer = css({
  flexGrow: '0',
  padding: `${variables.emptyPage.buttonVerticalGap}px ${variables.gap.big}px`,
}).toString();

const button = css({
  width: '100%',
}).toString();

export default {
  wrapper,
  container,
  icon,
  title,
  buttonContainer,
  button,
};
