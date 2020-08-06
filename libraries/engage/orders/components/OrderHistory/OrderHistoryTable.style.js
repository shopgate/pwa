import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

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
