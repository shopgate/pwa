import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;
const contentPadding = `${variables.gap.small * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.big}px`;
const contentBoxShadow = 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px';

export const productContainer = css({
  padding: variables.gap.big,
  fontSize: '0.875rem',
  boxShadow: `inset 0 1px 0 ${colors.shade7}`,
}).toString();

export const productContainerInner = css({
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const productImage = css({
  flex: '0 0 auto',
  width: '2.5rem',
  height: '2.5rem',
  background: colors.placeholder,
  marginRight: variables.gap.big,
}).toString();

export const productContent = css({
  flexGrow: 1,
  display: 'block',
}).toString();

export const productName = css({
  fontWeight: 600,
  marginBottom: variables.gap.small,
}).toString();

export const variants = css({
  color: colors.shade3,
  marginBottom: variables.gap.small,
}).toString();

export const stores = css({
  background: colors.background,
  padding: contentPadding,
  fontSize: '0.875rem',
  boxShadow: contentBoxShadow,
}).toString();

export const store = css({
  background: colors.light,
  boxShadow: '0 1px 2px rgba(0, 0, 0, .117647)',
  marginBottom: variables.gap.big,
  ':last-of-type': {
    marginBottom: 0,
  },
}).toString();

export const storeMain = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  padding: `${variables.gap.small * 1.5}px ${variables.gap.big}px`,
  boxShadow: `inset 0 -1px 0 ${colors.shade7}`,
}).toString();

export const storeInfo = css({
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
  width: '100%',
}).toString();

export const storeHeading = css({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: variables.gap.small,
}).toString();

export const storeName = css({
  fontSize: '1rem',
  fontWeight: 500,
}).toString();

export const storeDistance = css({
  whiteSpace: 'nowrap',
  color: colors.shade3,
}).toString();

export const storeHoursToday = css({
  color: colors.shade3,
}).toString();

export const storeDetails = css({
  display: 'flex',
  flexWrap: 'wrap',
}).toString();

export const storeDetailsOperationHours = css({
  padding: `0 ${variables.gap.big}px ${variables.gap.big}px 0`,
  flexShrink: 0,
}).toString();

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const addressIcon = css({
  fontSize: '1.25rem',
  padding: `2px ${variables.gap.small}px 0 0`,
}).toString();

export const openingHours = css({
  display: 'table',
}).toString();

export const openingHoursRow = css({
  display: 'table-row',
}).toString();

export const openingHoursDay = css({
  display: 'table-cell',
  paddingRight: variables.gap.big,
}).toString();

export const phone = css({
  paddingTop: variables.gap.small,
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const phoneIcon = css({
  fontSize: '1.25rem',
  paddingRight: variables.gap.small,
}).toString();
