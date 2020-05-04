import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const header = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  fontWeight: 500,
  fontSize: '1.25rem',
  padding: `0 ${variables.gap.big}px ${variables.gap.small}px ${variables.gap.big}px`,
});

export const column = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  flexShrink: 0,
  flexGrow: 1,
  flexBasis: 0,
  padding: `0 ${variables.gap.small}px`,
  ':last-child': {
    paddingRight: variables.gap.small,
  },
});

export const imageColumn = css({
  flexGrow: 0,
  width: 120,
  margin: `0 ${variables.gap.small}px 0 ${variables.gap.big}px`,
  paddingLeft: 0,
});

export const detailsColumn = css(column, {
  flexShrink: 1,
  flexGrow: 3,
  alignItems: 'flex-start',
  padding: 0,
});

export const quantityPickerColumn = css(column, {
  ' > *': {
    width: 140,
    textAlign: 'center',
  },
});

export const contextMenuColumn = css({
  width: variables.gap.xbig + variables.gap.small,
});
