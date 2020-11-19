import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: variables.gap.big,
}).toString();

export const imageColumn = css({
  width: 120,
  height: 120,
  marginRight: variables.gap.small,
  flexShrink: 0,
  flexGrow: 0,
});

export const column = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 0,
  padding: `0 ${variables.gap.small}px`,
  ':last-child': {
    paddingRight: 0,
  },
});

export const detailsColumn = css(column, {
  flexShrink: 1,
  flexGrow: 3,
  alignItems: 'flex-start',
});

export const priceColumnWide = css(column, {
  flexGrow: 4,
  alignItems: 'flex-end',
});

export const locationColumn = css(column, {
  fontSize: '1.25rem',
  lineHeight: '1.625rem',
  fontWeight: 500,
  flexGrow: 2,
});

export const statusColumn = css(column, {
  fontSize: '1.25rem',
  lineHeight: '1.625rem',
});

export const productName = css({
  fontSize: '1.25rem',
  lineHeight: '1.5rem',
  fontWeight: 500,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

export const productProperties = css({
  paddingTop: variables.gap.small,
  color: 'var(--color-text-low-emphasis)',
  fontSize: '1rem',
}).toString();

export const quantityPicker = css({
  width: 140,
}).toString();

export const quantityPickerDisabled = css({
  padding: `0 ${variables.gap.small}px`,
  textAlign: 'center',
  fontSize: '1.25rem',
  lineHeight: '1.625rem',
  height: 28,
  width: '100%',
  fontWeight: 500,
  color: 'var(--color-text-high-emphasis)',
  whiteSpace: 'nowrap',
}).toString();

export const containerInactive = css({
  color: 'var(--color-text-low-emphasis)',
  [` .${quantityPickerDisabled}`]: {
    color: 'var(--color-text-low-emphasis)',
  },
  [` .${imageColumn}`]: {
    opacity: 0.7,
  },
}).toString();

export const price = css({
  fontSize: '1.25rem',
  lineHeight: '1.625rem',
}).toString();

export const priceInfo = css({
  wordBreak: 'break-word',
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  color: 'var(--color-text-low-emphasis)',
  padding: `${variables.gap.xsmall}px 0`,
}).toString();

export const contextMenu = css({
  marginTop: `-${variables.gap.xsmall * 3}px`,
  marginRight: `-${variables.gap.big}px`,
}).toString();

export const messageContainer = css({
  marginTop: 0,
}).toString();

export const messageContainerRope = css({
  marginTop: 0,
  marginBottom: 0,
}).toString();
