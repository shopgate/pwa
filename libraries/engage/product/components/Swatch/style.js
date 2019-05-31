import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const swatchGrid = css({
  gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))',
  gridGap: '2px',
  display: 'grid',
  marginBottom: '0.2rem',
}).toString();

export const item = css({
  minWidth: '12px',
  width: '12px',
  maxWidth: '12px',
  minHeight: '12px',
  height: '12px',
  maxHeight: '12px',
  borderRadius: '50%',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: colors.shade4,
}).toString();

export const itemTexture = css({
  backgroundSize: 'cover',
}).toString();

export const itemSelected = css({
  borderColor: colors.dark,
}).toString();
