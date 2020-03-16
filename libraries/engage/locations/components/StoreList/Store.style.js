import { css } from 'glamor';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

const baseCardPadding = `${gap.small}px ${gap.big}px`;
const gapM = gap.small + gap.xsmall;

export const stores = css({
  background: themeColors.background,
  padding: `${gapM}px ${gapM}px ${gap.big}px`,
  fontSize: '0.875rem',
  boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
}).toString();

export const storeCard = css({
  background: themeColors.light,
  marginBottom: gapM,
  ':last-of-type': {
    marginBottom: 0,
  },
  border: '1px solid #EBEBEB',
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: '0px 0px 3px 3px',
}).toString();

export const storeHeader = css({
  cursor: 'pointer',
  padding: `${baseCardPadding} ${gap.xsmall}px`,
}).toString();

export const storeName = css({
  fontSize: '1rem',
  fontWeight: 500,
}).toString();

export const storeDistance = css({
  whiteSpace: 'nowrap',
  color: themeColors.gray,
}).toString();

export const storeDetailsBody = css({
  padding: baseCardPadding,
  borderTop: `1px solid ${themeColors.shade7}`,
}).toString();

export const storeHoursToday = css({
  color: themeColors.gray,
}).toString();

export const address = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  color: themeColors.gray,
  marginBottom: gapM,
}).toString();

export const addressIcon = css({
  color: themeColors.shade7,
  fontSize: '1.4rem',
  padding: `${gap.xsmall}px ${gap.big}px 0 0`,
}).toString();

export const detailsIcon = css({
  color: themeColors.shade3,
  fontSize: '1.4rem',
  padding: `${gap.xsmall}px ${gap.big}px 0 0`,
}).toString();

export const detailsLine = css({
  marginTop: gapM,
}).toString();

export const details = css({
  paddingTop: gap.xsmall,
}).toString();

export const openingHours = css({
  display: 'table',
}).toString();

export const openingHoursRow = css({
  display: 'table-row',
}).toString();

export const openingHoursDay = css({
  display: 'table-cell',
  paddingRight: gap.big,
}).toString();

export const detailsPrimary = css({
  color: themeColors.primary,
  lineHeight: '0.825rem',
}).toString();

export const detailsSecondary = css({
  color: themeColors.shade3,
  fontSize: '0.75rem',
}).toString();
