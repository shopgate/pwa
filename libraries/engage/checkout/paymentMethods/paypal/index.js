import { isAvailable } from '@shopgate/native-modules';
import Provider from './PaypalProvider';
import Button from './PaypalButton';
import PayButton from './PaypalPayButton';

export default {
  code: 'paypal',
  provider: Provider,
  button: Button,
  content: () => null,
  payButton: !isAvailable() ? PayButton : null,
};
