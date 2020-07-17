// @flow
import { css } from 'glamor';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const root = css({
  padding: gap.big,
  display: 'flex',
  justifyContent: 'space-between',
}).toString();

export const checkbox = css({
  marginLeft: 8,
}).toString();

export const text = css({
  flexGrow: 0,
}).toString();

export const space = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}).toString();

