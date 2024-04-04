import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';

export default {
  button: css({
    lineHeight: '16.5px',
    color: themeConfig.colors.warning,
    width: '100%',
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
  rightAligned: css({
    display: 'inline-block',
    textAlign: 'right',
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
  iconCentered: css({
    alignSelf: 'center',
    marginLeft: '-1px',
    marginRight: '8px',
  }).toString(),
};
