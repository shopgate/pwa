import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const responsiveContainer = css({
  position: 'relative',
  height: 0,
  overflow: 'hidden',
  padding: '56.25% 0 0 0',
  ' iframe, object, embed': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  },
});

const consentContainer = css({
  position: 'absolute',
  height: '100%',
  width: '100%',
  padding: 16,
  fontSize: '0.9rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 24,
  background: colors.shade10,
  border: `1px solid ${colors.shade5}`,
  // Add a tiny little border radius to make the message container look nice with padding
  borderRadius: 4,
  top: 0,
});

const consentLink = css({
  textAlign: 'center',
  color: colors.primary,
  fontWeight: 500,
}).toString();

const consentIcon = css({
  fill: colors.shade5,
  height: 48,
});

export default {
  responsiveContainer,
  consentContainer,
  consentLink,
  consentIcon,
};
