import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const title = css({
  fontSize: '1.5rem',
  padding: variables.gap.big,
}).toString();

export const tabs = css({
  width: '100%',
  position: 'sticky',
  top: 64,
  background: 'rgb(255, 255, 255)',
  boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
}).toString();
