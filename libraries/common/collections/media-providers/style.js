import { css } from '@shopgate/engage/styles';

const responsiveContainer = css({
  position: 'relative',
  height: 0,
  overflow: 'hidden',
  padding: '56.25% 0 0 0',
  fontSize: '0.875rem',
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
  lineHeight: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 16,
  background: 'var(--sg-palette-grey-light)',
  border: '1px solid --sg-components-border-medium',
  borderRadius: 4,
  top: 0,
});

const consentLink = css({
  textAlign: 'center',
  color: 'var(--sg-palette-primary-main)',
  fontWeight: 500,
}).toString();

const consentIcon = css({
  fill: 'var(--sg-palette-grey-medium)',
  height: 40,
});

export default {
  responsiveContainer,
  consentContainer,
  consentLink,
  consentIcon,
};
