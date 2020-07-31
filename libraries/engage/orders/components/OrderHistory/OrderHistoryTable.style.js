import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const table = css({
  borderRadius: 4,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(0,0,0,.12)',
  margin: `${variables.gap.small * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.big}px`,
}).toString();

export const tableHeader = css({
  '& > th': {
    padding: variables.gap.big,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}).toString();

export const tableRow = css({
  borderTopWidth: 1,
  borderTopStyle: 'solid',
  borderTopColor: 'rgba(0, 0, 0, 0.12)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,.04)',
  },
  '& > td': {
    padding: variables.gap.big,
  },
}).toString();
