import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { font } = themeConfig;

const styles = {
  family: 'Roboto, Arial, sans-serif',
  rootSize: 16,
  lineHeight: 1.5,
  ...font,
};

css.global('body', {
  font: `${styles.rootSize}px/${styles.lineHeight} ${styles.family}`,
});

export default styles;
