import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default {
  button: css({
    color: themeConfig.colors.primary,
    textDecoration: 'underline',
  }).toString(),
  buttonContent: css({
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  backInStockMessageContainer: css({
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  backInStockMessage: css({
    marginLeft: '8px',
  }).toString(),
  buttonText: css({
    marginLeft: '8px',
    textDecoration: 'underline',
  }).toString(),

};
