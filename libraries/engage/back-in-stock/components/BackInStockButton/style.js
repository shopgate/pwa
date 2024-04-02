import { css } from 'glamor';

export default {
  button: css({
    lineHeight: '16.5px',
  }).toString(),
  buttonContent: css({
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  backInStockMessageContainer: css({
    lineHeight: '16.5px',
    display: 'flex',
    alignItems: 'center',
    width: 'auto',
  }).toString(),
  backInStockMessage: css({
    verticalAlign: 'middle',
    fontSize: '0.875rem',
  }).toString(),
  buttonText: css({
    fontSize: '0.875rem',

  }).toString(),
  icon: css({
    marginRight: 4,
    marginTop: -1,
    verticalAlign: 'middle',
    flexShrink: 0,
    alignSelf: 'flex-start',
    display: 'inline-flex',
  }).toString(),
};
