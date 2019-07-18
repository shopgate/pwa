import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const swatchClass = css({
  gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))',
  gridGap: '2px',
  display: 'grid',
  marginBottom: '0.2rem',
}).toString();

export const itemClass = css({
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
  backgroundSize: 'cover',
}).toString();

export const itemSelectedClass = css({
  borderColor: colors.accent,
}).toString();
