import { css } from 'glamor';
import { themeShadows } from '@shopgate/pwa-common/helpers/config';

export default css({
  transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  boxShadow: themeShadows.material,
});
