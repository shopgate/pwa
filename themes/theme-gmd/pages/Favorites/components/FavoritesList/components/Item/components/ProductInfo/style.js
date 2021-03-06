import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const name = css({
  fontWeight: 500,
  lineHeight: 1.125,
  marginBottom: '1em',
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

const propertiesContainer = css({
  paddingRight: variables.gap.small,
  fontSize: 14,
}).toString();

const priceContainer = css({
  paddingLeft: variables.gap.small,
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  fontSize: 14,
  textAlign: 'right',
}).toString();

const detailsRow = css({
  justifyContent: 'space-between',
  alignItems: 'flex-end',
}).toString();

export default {
  detailsRow,
  name,
  priceContainer,
  propertiesContainer,
};
