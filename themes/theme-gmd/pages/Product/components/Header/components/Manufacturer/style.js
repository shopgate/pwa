import { css } from 'glamor';

const infoContainer = css({
  alignSelf: 'flex-end',
  fontWeight: 500,
  marginTop: -2,
}).toString();

const placeholder = css({
  height: 16,
  width: '70%',
  marginTop: 5,
  marginBottom: 2,
}).toString();

export default {
  infoContainer,
  placeholder,
};
