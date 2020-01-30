import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;
const contentPadding = `${variables.gap.small * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.big}px`;
const contentBoxShadow = 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px';

export const productContainer = css({
  padding: variables.gap.big,
  fontSize: '0.875rem',
  boxShadow: `inset 0 1px 0 ${colors.shade7}`,
});

export const productContainerInner = css({
  display: 'flex',
  flexFlow: 'row nowrap',
});

export const productImage = css({
  flex: '0 0 auto',
  width: '2.5rem',
  height: '2.5rem',
  background: colors.placeholder,
  marginRight: variables.gap.big,
});

export const productContent = css({
  flexGrow: 1,
  display: 'block',
});

export const productName = css({
  fontWeight: 600,
  marginBottom: variables.gap.small,
});

export const variants = css({
  color: colors.shade3,
  marginBottom: variables.gap.small,
});

export const availability = css({
  display: 'flex',
  flexFlow: 'row nowrap',
});

export const availabilityText = css({
  color: colors.warning,
});

export const availabilityStores = css({
  flexGrow: 1,
  textAlign: 'right',
});

export const stores = css({
  background: colors.background,
  padding: contentPadding,
  fontSize: '0.875rem',
  boxShadow: contentBoxShadow,
});

export const store = css({
  background: colors.light,
  boxShadow: '0 1px 2px rgba(0, 0, 0, .117647)',
  marginBottom: variables.gap.big,
  ':last-of-type': {
    marginBottom: 0,
  },
});

export const storeMain = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  padding: `${variables.gap.small * 1.5}px ${variables.gap.big}px`,
  boxShadow: `inset 0 -1px 0 ${colors.shade7}`,
});

export const storeImage = css({
  borderRadius: '100%',
  flexGrow: 1,
  flexShrink: 0,
  background: colors.placeholder,
  marginRight: variables.gap.big,
  width: 48,
  height: 48,
});

export const storeInfo = css({
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
  width: '100%',
});

export const storeName = css({
  fontSize: '1rem',
  fontWeight: 500,
});

export const storeHoursToday = css({
  color: colors.shade3,
});

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  paddingTop: variables.gap.small * 0.5,
  color: colors.shade3,
});

export const addressIcon = css({
  fontSize: '1.25rem',
  padding: `2px ${variables.gap.small}px 0 0`,
});

export const openingHours = css({
  display: 'table',
});

export const openingHoursRow = css({
  display: 'table-row',
});

export const openingHoursDay = css({
  display: 'table-cell',
  paddingRight: variables.gap.big,
});

export const phone = css({
  paddingTop: variables.gap.small,
  display: 'flex',
  flexFlow: 'row nowrap',
});

export const phoneIcon = css({
  fontSize: '1.25rem',
  paddingRight: variables.gap.small,
});
