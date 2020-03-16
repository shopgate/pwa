import { css } from 'glamor';
import { themeVariables, themeColors, themeShadows } from '@shopgate/pwa-common/helpers/config';

const contentPadding = `${themeVariables.gap.small * 1.5}px ${themeVariables.gap.small * 1.5}px ${themeVariables.gap.big}px`;
const contentBoxShadow = `inset ${themeShadows.material}`;

export const stores = css({
  overflowY: 'auto',
  background: themeColors.background,
  padding: contentPadding,
  fontSize: '0.875rem',
  boxShadow: contentBoxShadow,
}).toString();

export const store = css({
  background: themeColors.light,
  boxShadow: '0 1px 2px rgba(0, 0, 0, .117647)',
  marginBottom: themeVariables.gap.big,
  ':last-of-type': {
    marginBottom: 0,
  },
}).toString();

export const storeMain = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  padding: `${themeVariables.gap.small * 1.5}px ${themeVariables.gap.big}px`,
  boxShadow: `inset 0 -1px 0 ${themeColors.shade7}`,
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
  paddingBottom: themeVariables.gap.small,
}).toString();

export const storeName = css({
  fontSize: '1rem',
  fontWeight: 500,
}).toString();

export const storeDistance = css({
  whiteSpace: 'nowrap',
  color: themeColors.shade3,
}).toString();

export const storeHoursToday = css({
  color: themeColors.shade3,
}).toString();

export const storeDetails = css({
  display: 'flex',
  flexWrap: 'wrap',
}).toString();

export const storeDetailsOperationHours = css({
  padding: `0 ${themeVariables.gap.big}px ${themeVariables.gap.big}px 0`,
  flexShrink: 0,
}).toString();

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const addressIcon = css({
  fontSize: '1.25rem',
  padding: `2px ${themeVariables.gap.small}px 0 0`,
}).toString();

export const openingHours = css({
  display: 'table',
}).toString();

export const openingHoursRow = css({
  display: 'table-row',
}).toString();

export const openingHoursDay = css({
  display: 'table-cell',
  paddingRight: themeVariables.gap.big,
}).toString();

export const phone = css({
  paddingTop: themeVariables.gap.small,
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const phoneIcon = css({
  fontSize: '1.25rem',
  paddingRight: themeVariables.gap.small,
}).toString();
