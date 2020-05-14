import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const supplementalContent = css({
  padding: variables.gap.big,
}).toString();
