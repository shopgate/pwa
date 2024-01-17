import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default {
  button: css({
    marginTop: '4px',
    color: themeConfig.colors.primary,
    textDecoration: 'underline',
  }).toString(),
  buttonContent: css({
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  backInStockMessageContainer: css({
    marginTop: '4px',
    display: 'inline',
    alignItems: 'center',
  }).toString(),
  backInStockMessage: css({
    marginLeft: '4px',
    verticalAlign: 'middle',
    textDecoration: 'underline',
  }).toString(),
  buttonText: css({
    marginLeft: '4px',
    textDecoration: 'underline',
  }).toString(),
  icon: css({
    verticalAlign: 'middle',
    display: 'inline',
  }).toString(),

};
