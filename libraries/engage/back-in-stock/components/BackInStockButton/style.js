import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';

export default {
  button: css({
    lineHeight: '16.5px',
    color: themeConfig.colors.warning,
  }).toString(),
  buttonContent: css({
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  rightAligned: css({
    display: 'inline-block',
    textAlign: 'right',
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
