import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  position: 'absolute',
  background: 'var(--sg-tab-bar-item-badge-background)',
  color: 'var(--sg-tab-bar-item-badge-color)',
  fontSize: '0.7rem',
  lineHeight: 1.5,
  fontWeight: 'bold',
  borderRadius: 'var(--sg-tab-bar-item-badge-border-radius)',
  height: variables.gap.big,
  top: -variables.gap.small,
  paddingLeft: variables.gap.small / 2,
  paddingRight: variables.gap.small / 2,
  minWidth: variables.gap.big,
  transform: 'translateX(-50%)',
  left: 'calc(50% + 20px)',
}).toString();
