import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const table = css({
  borderRadius: 4,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(0,0,0,.12)',
  cursor: 'pointer',
}).toString();

export const tableHeader = css({
  '& > td': {
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
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,.04)',
  },
  '& > td': {
    padding: variables.gap.big,
  },
}).toString();
