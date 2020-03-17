// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  fontWeight: 500,
  marginBottom: variables.gap.xsmall,
});
