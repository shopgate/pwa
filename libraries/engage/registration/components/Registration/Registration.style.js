import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { styles as formStyles } from '../../../checkout/components/Form';

const { variables } = themeConfig;

export const container = css({
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  '@media(min-width: 768px)': {
    flexDirection: 'row-reverse',
    '> :not(:first-child)': {
      marginRight: variables.gap.big,
    },
  },
});

export const containerItem = css({
  flexGrow: 1,
  flexShrink: 0,
});

export const form = css({
  ...formStyles,
});

export const section = css({
  marginBottom: variables.gap.big * 1.5,
}).toString();

export const submitButtonContainer = css({
  margin: `0 ${variables.gap.big}px ${variables.gap.big}px`,
  '@media(min-width: 768px)': {
    maxWidth: '60%',
  },
});

export const submitButton = css({
  width: '100%',
}).toString();
