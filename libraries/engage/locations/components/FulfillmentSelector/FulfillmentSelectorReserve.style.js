// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  fontSize: '0.75rem',
  paddingTop: variables.gap.xsmall * 0.5,
});
