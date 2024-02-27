import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';

export default {
  button: css({
    color: themeConfig.colors.primary,
  }).toString(),
  buttonContent: css({
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  backInStockMessageContainer: css({
    display: 'inline',
    alignItems: 'center',
    lineHeight: '20px',
  }).toString(),
  backInStockMessage: css({
    marginLeft: '4px',
    verticalAlign: 'middle',
    fontSize: '0.875rem',
  }).toString(),
  buttonText: css({
    marginLeft: '4px',
    fontSize: '0.875rem',
  }).toString(),
  icon: css({
    verticalAlign: 'middle',
    display: 'inline',
  }).toString(),
};
