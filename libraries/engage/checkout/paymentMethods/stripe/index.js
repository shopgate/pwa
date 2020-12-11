import Provider from './StripeProvider';
import StripeCreditCard from './StripeCreditCard';
import PayButton from './StripePayButton';
import Button from './StripeButton';

export default {
  code: 'stripe',
  provider: Provider,
  content: StripeCreditCard,
  button: Button,
  payButton: PayButton,
};
