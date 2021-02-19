import { css } from 'glamor';
import { themeShadows } from '@shopgate/pwa-common/helpers/config';

export default css({
  boxShadow: themeShadows.material,
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 1,
});
