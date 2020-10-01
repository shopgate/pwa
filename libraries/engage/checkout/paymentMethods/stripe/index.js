import Provider from './StripeProvider';
import StripeCreditCard from './StripeCreditCard';
import Button from './StripeButton';

export default {
  code: 'stripe',
  provider: Provider,
  content: StripeCreditCard,
  button: Button,
};
