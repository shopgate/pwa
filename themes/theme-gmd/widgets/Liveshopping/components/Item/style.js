import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const pane = {
  width: '50%',
  background: colors.light,
};

const image = css({
  ...pane,
}).toString();

const infoPane = css({
  ...pane,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}).toString();

const priceGrid = css({
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginTop: variables.gap.small,
}).toString();

const priceStriked = css({
  fontSize: '0.875rem',
}).toString();

const price = css({
  color: `var(--color-primary, ${colors.primary})`,
  fontSize: '1.25rem',
  lineHeight: 1,
}).toString();

const card = {
  margin: '5px 15px 10px',
};

const title = {
  marginBottom: variables.gap.small * 0.5,
};

const timer = css({
  fontSize: '0.875rem',
  color: `var(--color-primary, ${colors.primary})`,
  fontStyle: 'italic',
  fontWeight: 500,
}).toString();

export default {
  image,
  infoPane,
  priceGrid,
  priceStriked,
  price,
  card,
  title,
  timer,
};
