import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;
const { small, big } = variables.gap;

const minImageSize = 110;

export const grid = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  padding: `0 ${big}px ${big}px ${big}px`,
}).toString();

export const gridItem = css({
  width: '50%',
  display: 'flex',
  ':nth-child(even)': {
    padding: `0 0 ${big}px ${small}px`,
  },
  ':nth-child(odd)': {
    padding: `0 ${small}px ${big}px 0`,
  },
  '&:nth-child(2n+1):nth-last-child(-n+2), &:nth-child(2n+1):nth-last-child(-n+2) ~ li': {
    paddingBottom: 0,
  },

}).toString();

export const gridItemInner = css({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  minHeight: minImageSize,
  border: `1px solid ${colors.shade7}`,
}).toString();

export const gridItemColumnLeft = css({
  flex: 1,
  padding: big,
  display: 'flex',
  flexDirection: 'column',
}).toString();

export const gridItemColumnRight = css({
  width: '20%',
  minWidth: minImageSize,
}).toString();

export const categoryTitle = css({
  fontSize: '1.5rem',
  lineHeight: '1.5rem',
  margin: 'auto',
  [responsiveMediaQuery('<=sm', { webOnly: true })]: {
    fontSize: '1.25rem',
    lineHeight: '1.25rem',
  },
}).toString();

export const placeholder = css({
  ' > * ': {
    margin: 'auto',
    marginLeft: 0,
  },
}).toString();

export const categoryDescription = css({
  color: 'var(--color-text-medium-emphasis)',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  fontWeight: 'initial',
  paddingTop: variables.gap.small,
  ':empty': {
    display: 'none',
  },
}).toString();

export const categoryImage = css({
  display: 'flex',
  width: '100%',
  ' img': {
    width: 'inherit !important',
    maxWidth: 'inherit !important',
  },
}).toString();
